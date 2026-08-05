const fs = require('fs');
const path = require('path');

const srcPath = '/Users/butt/Desktop/eduplexo/pts_complete_english_data.json';
const outputDir = '/Users/butt/Desktop/eduplexo/data/questions';
const outputJsonPath = path.join(outputDir, 'ptb-one-english.json');
const outputSqlPath = path.join(outputDir, 'seed_questions.sql');

// Make sure output dir exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Database IDs resolved from current DB state
const CLASS_ID = 'gcls_945589bff9408c32';
const CLASS_NAME = 'ONE';
const SUBJECT_ID = 'gsub_61e7b1e4f8b1bc32';
const SUBJECT_NAME = 'English';
const SYLLABUS = 'ptb';

// Mapping from TopicRef/code to Database Chapter ID & Display Title
const chapterMap = {
  "1.1": { id: "gch_8b08ad9913937971", title: "UNIT 1: Time to Recall" },
  "2.1": { id: "gch_99594bc9e666dd45", title: "UNIT 2: My Family and I" },
  "3.1": { id: "gch_a19feee121fc3fb4", title: "UNIT 3: Cobbler, Cobbler" },
  "R1": { id: "gch_faa9c255f46d096f", title: "REVIEW 1" },
  "4.1": { id: "gch_36c055fc3d5698e1", title: "UNIT 4: Let's Have Fun!" },
  "5.1": { id: "gch_efae9822c7f2f934", title: "UNIT 5: Sharing is Caring" },
  "R2": { id: "gch_0381c3c3741a7f6b", title: "REVIEW 2" },
  "6.1": { id: "gch_ded975dddfc4492b", title: "UNIT 6: Blessings of Allah سبحان تعالیٰ" },
  "7.1": { id: "gch_a33dd7fadbe75f63", title: "UNIT 7: Classroom Manners" },
  "8.1": { id: "gch_8b86f4289f903d9d", title: "UNIT 8: Nature is Beautiful" },
  "R3": { id: "gch_9737d61e55d7d73c", title: "REVIEW 3" },
  "9.1": { id: "gch_961f0cfb4a9bf742", title: "UNIT 9: A Greeting Card" },
  "10.1": { id: "gch_d2c4d99ac3c4e417", title: "UNIT 10: The Hare and the Tortoise" },
  "11.1": { id: "gch_a9747bd7f02d4652", title: "UNIT 11: Love Animals" },
  "R4": { id: "gch_12c68f590874a195", title: "REVIEW 4" },
  "EB1": { id: "gch_9d0fda19dfb1665a", title: "English B" },
  "EB2": { id: "gch_9d0fda19dfb1665a", title: "English B" },
  "EB3": { id: "gch_9d0fda19dfb1665a", title: "English B" },
  "EB4": { id: "gch_9d0fda19dfb1665a", title: "English B" },
  "EB5": { id: "gch_9d0fda19dfb1665a", title: "English B" },
  "EB6": { id: "gch_9d0fda19dfb1665a", title: "English B" },
  "EB7": { id: "gch_9d0fda19dfb1665a", title: "English B" },
};

// Map _questionType code to question type ID
const typeIdMap = {
  1: 'mcq',
  2: 'tick_correct_spelling',
  6: 'grammar',
  7: 'fill_in_the_blanks',
  10: 'true_false_statements',
  11: 'match_columns',
  14: 'question_answers',
  15: 'letters'
};

// Default marks for each question type
const defaultMarksMap = {
  'mcq': 1,
  'tick_correct_spelling': 1,
  'grammar': 1,
  'fill_in_the_blanks': 1,
  'true_false_statements': 1,
  'match_columns': 1,
  'question_answers': 2,
  'letters': 5
};

function cleanOptionText(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\r?\n|\r/g, ' ') // remove newlines
    .replace(/\s+/g, ' ') // normalize whitespace
    .trim();
}

function cleanHtmlText(html) {
  if (!html) return '';
  return html
    .replace(/\r?\n|\r/g, '\n') // normalize newlines
    .trim();
}

console.log('Loading raw data...');
const rawData = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

const processedQuestions = [];
let questionCounter = 0;

rawData.forEach(entry => {
  const qType = entry._questionType;
  const mappedType = typeIdMap[qType];
  if (!mappedType) {
    // Skip unmapped types or empty blocks
    return;
  }

  const qList = entry.QuestionsList || [];
  qList.forEach(q => {
    questionCounter++;
    
    // Resolve chapter/topic
    const topicRef = q.TopicRef ? q.TopicRef.trim() : '1.1';
    const chInfo = chapterMap[topicRef] || { id: 'gch_8b08ad9913937971', title: 'UNIT 1: Time to Recall' };
    
    // Clean Question HTML details
    const questionHtml = cleanHtmlText(q.EnglishQuestionDetails || q.UrduQuestionDetails || '');
    
    // Options & Answer extraction
    const rawOptions = q.MultipleOptions || [];
    const options = [];
    let answerText = '';

    rawOptions.forEach(opt => {
      const cleanOpt = cleanOptionText(opt.EmOption || opt.UmOption || '');
      if (cleanOpt) {
        options.push(cleanOpt);
        if (opt.Answer === true) {
          answerText = cleanOpt;
        }
      }
    });

    // Fallbacks if no options are parsed (e.g. for blanks or written types)
    const marks = defaultMarksMap[mappedType] || 1;
    const cleanAnswer = cleanOptionText(q.EnglishFillAnswer || q.UrduFillAnswer || answerText || (q.TrueFalseAnswer ? 'True' : ''));

    // Question metadata
    const metadata = {
      original_question_id: q.QuestionID,
      topic_id: q.TopicID,
      topic_name: q.TopicName,
      priority: q.QuestionPeriority,
      chapter: chInfo.title
    };

    processedQuestions.push({
      _id: `q_global_eng_${q.QuestionID}`,
      school_id: '__global__',
      created_by: 'system',
      created_by_name: 'System Seed',
      class_id: CLASS_ID,
      class_name: CLASS_NAME,
      subject_id: SUBJECT_ID,
      subject_name: SUBJECT_NAME,
      chapter_id: chInfo.id,
      chapter_name: chInfo.title,
      chapter: topicRef, // Store topicRef directly at root chapter field to match selectedChapterSet/selectedChapterTitles
      type: mappedType,
      difficulty: 'medium',
      question_html: questionHtml,
      options: options, // Save options directly as a JSON array of strings (parsed)
      answer: cleanAnswer,
      marks: marks,
      metadata: metadata, // Save metadata directly as a JSON object (parsed)
      status: 'active',
      is_global: true,
      approval_status: 'approved'
    });
  });
});

console.log(`Processed ${processedQuestions.length} questions.`);

// Write JSON file
fs.writeFileSync(outputJsonPath, JSON.stringify(processedQuestions, null, 2) + '\n');
console.log(`Saved clean JSON to: ${outputJsonPath}`);

// Generate SQL Script (SQL requires JSON columns as string representation)
let sqlContent = `
-- Seed English Questions for PTB Class 1
-- Generated on ${new Date().toISOString()}

BEGIN;

-- Delete old seeds if any
DELETE FROM questions WHERE school_id = '__global__' AND id LIKE 'q_global_eng_%';

`;

processedQuestions.forEach(q => {
  // Safe quote string values for SQL
  const escapeSql = (str) => {
    if (!str) return "''";
    return "'" + str.replace(/'/g, "''") + "'";
  };

  sqlContent += `INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  ${escapeSql(q._id)},
  '__global__',
  'system',
  'System Seed',
  ${escapeSql(q.class_id)},
  ${escapeSql(q.class_name)},
  ${escapeSql(q.subject_id)},
  ${escapeSql(q.subject_name)},
  ${escapeSql(q.chapter_id)},
  ${escapeSql(q.chapter_name)},
  ${escapeSql(q.type)},
  'medium',
  ${escapeSql(q.question_html)},
  ${escapeSql(JSON.stringify(q.options))},
  ${escapeSql(q.answer)},
  ${q.marks},
  ${escapeSql(JSON.stringify(q.metadata))}::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

`;
});

sqlContent += `COMMIT;\n`;

fs.writeFileSync(outputSqlPath, sqlContent);
console.log(`Saved SQL seed script to: ${outputSqlPath}`);
console.log('Done!');
