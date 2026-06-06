import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const schoolApp = path.join(root, "school-react-app");
const syllabusDir = path.join(root, "data", "syllabus");
const syllabusDestDir = path.join(schoolApp, "src", "data", "syllabus-json");

function normalizeUnits(units) {
  if (!Array.isArray(units)) return [];
  return units.map((unit, unitIndex) => {
    const unitId = String(unit.id || `unit-${unitIndex + 1}`);
    const chapters = Array.isArray(unit.chapters) ? unit.chapters : [];
    return {
      ...unit,
      id: unitId,
      title: unit.title || unit.name || `Unit ${unitIndex + 1}`,
      type: unit.type || "unit",
      chapters: chapters.map((chapter, chapterIndex) => ({
        ...chapter,
        id: String(chapter.id || `${unitId}-chapter-${chapterIndex + 1}`),
        code: String(chapter.code || `${unitIndex + 1}.${chapterIndex + 1}`),
        title: chapter.title || chapter.name || `Chapter ${chapterIndex + 1}`,
        type: chapter.type || "chapter",
      })),
    };
  });
}

function countChapters(units) {
  return units.reduce((total, unit) => total + (Array.isArray(unit.chapters) ? unit.chapters.length : 0), 0);
}

function main() {
  const registryMapPath = path.join(syllabusDestDir, "registry-map.json");
  if (!fs.existsSync(registryMapPath)) {
    console.error("registry-map.json not found! Please run the migration script first.");
    process.exit(1);
  }
  const registryMap = JSON.parse(fs.readFileSync(registryMapPath, "utf8"));

  const syllabusIds = ["ptb", "afaq", "oxford", "gohar"];

  for (const id of syllabusIds) {
    const configPath = path.join(syllabusDir, `${id}.json`);
    if (!fs.existsSync(configPath)) {
      console.warn(`Syllabus config not found: ${configPath}`);
      continue;
    }

    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    let sourceId = id;
    if (id === "afaq") sourceId = "afaq-snc";
    if (id === "oxford") sourceId = "oxford-snc";
    if (id === "gohar") sourceId = "gohar-snc";

    for (const cls of config.classes || []) {
      for (const subject of cls.subjects || []) {
        const key = `${sourceId}|${cls.name}|${subject.name}`;
        const matchedPath = registryMap[key];

        if (matchedPath) {
          const fullPath = path.join(syllabusDestDir, matchedPath);
          if (fs.existsSync(fullPath)) {
            const rawUnits = JSON.parse(fs.readFileSync(fullPath, "utf8"));
            const normalized = normalizeUnits(rawUnits);
            subject.chapters = normalized;
            subject.metadata.chapterGroups = normalized.length;
            subject.metadata.chapterCount = countChapters(normalized);
          } else {
            console.warn(`Source JSON file not found: ${fullPath}`);
          }
        }
      }

      // Recalculate class chapter count
      cls.metadata.chapterCount = cls.subjects.reduce((sum, s) => sum + (s.metadata.chapterCount || 0), 0);
    }

    // Write back with exact same formatting
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
    console.log(`Successfully rebuilt and updated ${configPath}`);
  }
}

main();
