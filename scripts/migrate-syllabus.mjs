import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const require = createRequire(import.meta.url);
const root = path.resolve(new URL("..", import.meta.url).pathname);
const schoolApp = path.join(root, "school-react-app");
const ts = require(path.join(schoolApp, "node_modules/typescript"));

const syllabusSrcDir = path.join(schoolApp, "src", "data", "syllabus");
const syllabusDestDir = path.join(schoolApp, "src", "data", "syllabus-json");

// Create target directory
fs.mkdirSync(syllabusDestDir, { recursive: true });

function getOldRegistryText() {
  try {
    return execSync("git show e26e6ac^:school-react-app/src/data/syllabus/registry.ts", { cwd: root, encoding: "utf8" });
  } catch (err) {
    console.error("Failed to get registry.ts from git history:", err);
    process.exit(1);
  }
}

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

function slug(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

function uniqueByValue(values) {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    const key = String(value).trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

function parseRegistry(registryText) {
  const imports = {};
  const importRegex = /import\s+\{\s*([A-Za-z0-9_]+)\s*\}\s+from\s+["']\.\/([^"']+)["']/g;
  let match;
  while ((match = importRegex.exec(registryText)) !== null) {
    imports[match[1]] = match[2]; // e.g. PTB_CLASS1_ENGLISH -> ptb-class1-english
  }

  const mappings = {};
  const mapRegex = /["']([^"']+)["']\s*:\s*([A-Za-z0-9_]+)\s+as\s+BaseUnit\[\]/g;
  while ((match = mapRegex.exec(registryText)) !== null) {
    mappings[match[1]] = match[2]; // e.g. "ptb|ONE|English" -> PTB_CLASS1_ENGLISH
  }

  return { imports, mappings };
}

const moduleCache = new Map();

function resolveTsFile(baseDir, specifier) {
  if (!specifier.startsWith(".")) {
    return specifier;
  }

  const base = path.resolve(baseDir, specifier);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  throw new Error(`Unable to resolve ${specifier} from ${baseDir}`);
}

function loadTsModule(filePath) {
  const resolved = path.resolve(filePath);
  if (moduleCache.has(resolved)) {
    return moduleCache.get(resolved).exports;
  }

  const source = fs.readFileSync(resolved, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: resolved,
  });

  const mod = { exports: {} };
  moduleCache.set(resolved, mod);

  const localRequire = (specifier) => {
    if (specifier.startsWith("@/")) {
      const aliasPath = path.join(schoolApp, "src", specifier.slice(2));
      return loadTsModule(resolveTsFile(path.dirname(aliasPath), aliasPath));
    }
    const target = resolveTsFile(path.dirname(resolved), specifier);
    if (path.isAbsolute(target)) {
      return loadTsModule(target);
    }
    try {
      return require(target);
    } catch {
      return {};
    }
  };

  const script = new vm.Script(outputText, { filename: resolved });
  const context = vm.createContext({
    require: localRequire,
    exports: mod.exports,
    module: mod,
    console,
  });
  script.runInContext(context);
  return mod.exports;
}

function cleanObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function areEqual(obj1, obj2) {
  return JSON.stringify(cleanObject(obj1)) === JSON.stringify(cleanObject(obj2));
}

function main() {
  console.log("Starting syllabus migration and parity verification...");

  // 1. Parse old registry.ts
  const registryText = getOldRegistryText();
  const { imports, mappings } = parseRegistry(registryText);
  console.log(`Parsed old registry: ${Object.keys(imports).length} imports, ${Object.keys(mappings).length} key mappings.`);

  // 2. Scan syllabus source files
  const files = fs.readdirSync(syllabusSrcDir)
    .filter(f => f.endsWith(".ts") && f !== "catalog.ts" && f !== "index.ts" && f !== "registry.ts");

  console.log(`Found ${files.length} TypeScript syllabus source files to migrate.`);

  const fileDataMap = {};
  const migratedFilesMapping = [];
  const jsonMappingData = {}; // For registry-map.json

  // 3. For each file, evaluate and save to new JSON path
  for (const file of files) {
    const srcPath = path.join(syllabusSrcDir, file);
    const exports = loadTsModule(srcPath);

    const name = path.basename(file, ".ts");
    const keys = Object.keys(exports);
    const arrayKey = keys.find(k => Array.isArray(exports[k]));
    if (!arrayKey) {
      throw new Error(`Could not find exported array in ${file}`);
    }

    const data = exports[arrayKey];
    fileDataMap[name] = data;

    const regexMatch = name.match(/^(ptb|afaq)-(class\d+|inter\d+)-(.*)$/);
    if (!regexMatch) {
      throw new Error(`Filename does not match expected pattern: ${file}`);
    }

    const board = regexMatch[1];
    const rawClass = regexMatch[2];
    const subject = regexMatch[3];
    const classFormatted = rawClass.replace(/^(class|inter)(\d+)$/, "$1-$2");

    const destDir = path.join(syllabusDestDir, board, classFormatted);
    fs.mkdirSync(destDir, { recursive: true });

    const destFile = `${subject}.json`;
    const destPath = path.join(destDir, destFile);

    fs.writeFileSync(destPath, JSON.stringify(data, null, 2) + "\n");
    migratedFilesMapping.push({
      oldFile: file,
      newFile: path.relative(schoolApp, destPath)
    });

    // Determine the JSON relative path for mapping
    const jsonRelPath = `${board}/${classFormatted}/${destFile}`;
    
    // Find all registry keys that mapped to this constant
    const constantNames = Object.keys(imports).filter(k => imports[k] === name);
    for (const constName of constantNames) {
      const regKeys = Object.keys(mappings).filter(k => mappings[k] === constName);
      for (const rk of regKeys) {
        jsonMappingData[rk] = jsonRelPath;
      }
    }
  }

  console.log(`Successfully migrated ${files.length} TS files to JSON under src/data/syllabus-json/`);

  // Write registry-map.json
  const registryMapPath = path.join(syllabusDestDir, "registry-map.json");
  fs.writeFileSync(registryMapPath, JSON.stringify(jsonMappingData, null, 2) + "\n");
  console.log(`Written registry-map.json to ${registryMapPath}`);

  // 4. Verify parity against existing compiled configs (data/syllabus/*.json)
  console.log("Verifying data parity against data/syllabus/ configs...");
  
  const boardsToVerify = ["ptb", "afaq"];
  let totalSyllabiVerified = 0;
  let totalSubjectsVerified = 0;
  let totalMismatches = 0;

  function lookupSyllabusData(boardId, className, subjectName) {
    let sourceId = boardId;
    if (boardId === "afaq") sourceId = "afaq-snc";

    const classCandidates = uniqueByValue([
      className,
      className === "5TH" ? "FIVE" : "",
      className === "6TH" ? "SIX" : "",
      className === "7TH" ? "7TH" : "",
    ]);

    const subjectCandidates = uniqueByValue([
      subjectName,
      subjectName.toUpperCase(),
      subjectName.replace(/\s+\((SUN|IQBAL|SNC|AFAQ SNC|OXFORD SNC|Oxford SNC|SRM)[^)]+\)/gi, ""),
      subjectName.replace(/\s+\((SUN|IQBAL)\s+SERIES\)/gi, ""),
      subjectName.replace(/\s+\(NEW\)/gi, " New"),
      subjectName.replace(/\s+\(.*?\)/g, ""),
      subjectName.replace(/^COMPUTER Science/i, "Computer"),
      subjectName.replace(/^Computer Science/i, "Computer"),
      subjectName.replace(/^GENERAL SCIENCE/i, "General Science"),
      subjectName.replace(/^ENGLISH/i, "English"),
      subjectName.replace(/^MATHEMATICS/i, "Mathematics"),
      subjectName.includes("اسلامیات") ? "Islamiat" : "",
      subjectName.includes("اُردو") ? "Urdu" : "",
    ]);

    for (const cls of classCandidates) {
      for (const subj of subjectCandidates) {
        const key = `${sourceId}|${cls}|${subj}`;
        const constName = mappings[key];
        if (constName) {
          const fileName = imports[constName];
          if (fileName && fileDataMap[fileName]) {
            return { data: fileDataMap[fileName], fileName };
          }
        }
      }
    }

    return null;
  }

  for (const board of boardsToVerify) {
    const configPath = path.join(root, "data", "syllabus", `${board}.json`);
    if (!fs.existsSync(configPath)) {
      console.warn(`Consolidated config file not found: ${configPath}`);
      continue;
    }

    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    console.log(`Checking board ${board.toUpperCase()} from ${configPath}...`);
    totalSyllabiVerified++;

    for (const cls of config.classes || []) {
      for (const subject of cls.subjects || []) {
        totalSubjectsVerified++;
        const lookupResult = lookupSyllabusData(board, cls.name, subject.name);

        if (!lookupResult) {
          if (subject.chapters.length === 0) {
            continue;
          }
          console.error(`Mismatch: Could not find source TS file for ${board} -> ${cls.name} -> ${subject.name} (has ${subject.chapters.length} chapters in config!)`);
          totalMismatches++;
          continue;
        }

        const normalizedSource = normalizeUnits(lookupResult.data);
        const configChapters = subject.chapters;

        if (!areEqual(normalizedSource, configChapters)) {
          console.error(`DATA MISMATCH for ${board} -> ${cls.name} -> ${subject.name} (Source: ${lookupResult.fileName})`);
          totalMismatches++;
        }
      }
    }
  }

  console.log(`Parity check finished. Syllabi checked: ${totalSyllabiVerified}, Subjects checked: ${totalSubjectsVerified}.`);
  if (totalMismatches > 0) {
    console.error(`PARITY CHECK FAILED WITH ${totalMismatches} MISMATCHES!`);
    process.exit(1);
  } else {
    console.log("✓ PARITY CHECK PASSED! 100% data match with existing production configs.");
  }

  const report = {
    totalTsFilesFound: files.length,
    totalJsonFilesCreated: files.length,
    mappings: migratedFilesMapping,
    parityConfirmed: true,
  };
  fs.writeFileSync(path.join(root, "migration-logs", "migration-report.json"), JSON.stringify(report, null, 2) + "\n");
  console.log("Migration report written to migration-logs/migration-report.json");
}

main();
