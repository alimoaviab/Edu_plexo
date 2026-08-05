const fs = require('fs');
const path = require('path');

const srcPath = '/Users/butt/Desktop/eduplexo/1.json';
const outputDir = '/Users/butt/Desktop/eduplexo/data/questions';
const outputJsonPath = path.join(outputDir, 'ptb-one-general-knowledge.json');
const outputSqlPath = path.join(outputDir, 'seed_questions_gk.sql');

// Make sure output dir exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Database IDs resolved from current DB state
const CLASS_ID = 'gcls_945589bff9408c32';
const CLASS_NAME = 'ONE';
const SUBJECT_ID = 'gsub_5031f4c3b6e883de';
const SUBJECT_NAME = 'General Knowledge';
const SYLLABUS = 'ptb';

// Mapping from TopicRef/code to Database Chapter ID & Display Title
const chapterMap = {
  "1.1": { id: "gch_fb3a8969da3ccb67", title: "Chapter 1: My Introduction" },
  "2.1": { id: "gch_78ddf1ee03023e7c", title: "Chapter 2: My Body" },
  "3.1": { id: "gch_afd1de0e4fdb54d8", title: "Chapter 3: Health and Hygiene" },
  "4.1": { id: "gch_3f58c09a6b76842f", title: "Chapter 4: My Family and Friends" },
  "5.1": { id: "gch_1071e802782c87a4", title: "Chapter 5: Games and Recreation" },
  "6.1": { id: "gch_a0ac64f4d44f5665", title: "Chapter 6: Our Morals" },
  "7.1": { id: "gch_65b7aa3eff9018c8", title: "Chapter 7: Places of Worship" },
  "8.1": { id: "gch_66d37a14e3fa67d7", title: "Chapter 8: Our Beloved Country Pakistan" },
  "9.1": { id: "gch_732ecb583a977057", title: "Chapter 9: My School" },
  "10.1": { id: "gch_a94c48a7b7c0f15b", title: "Chapter 10: Means of Transport" },
  "11.1": { id: "gch_3113e31b1ed2757a", title: "Chapter 11: Traffic Rules" },
  "12.1": { id: "gch_60ccb041e1697432", title: "Chapter 12: Good Moral Habits" },
  "13.1": { id: "gch_0222764504c9a967", title: "Chapter 13: Plants and Animals" },
  "14.1": { id: "gch_f025883adc5a7999", title: "Chapter 14: Earth and Sky" }
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
    const chInfo = chapterMap[topicRef] || { id: 'gch_fb3a8969da3ccb67', title: 'Chapter 1: My Introduction' };
    
    // Clean Question HTML details (Urdu text is primary here)
    const questionHtml = cleanHtmlText(q.UrduQuestionDetails || q.EnglishQuestionDetails || '');
    
    // Options & Answer extraction
    const rawOptions = q.MultipleOptions || [];
    const options = [];
    let answerText = '';

    rawOptions.forEach(opt => {
      const cleanOpt = cleanOptionText(opt.UmOption || opt.EmOption || '');
      if (cleanOpt) {
        options.push(cleanOpt);
        if (opt.Answer === true) {
          answerText = cleanOpt;
        }
      }
    });

    // Fallbacks if no options are parsed (e.g. for blanks or written types)
    const marks = defaultMarksMap[mappedType] || 1;
    const cleanAnswer = cleanOptionText(q.UrduFillAnswer || q.EnglishFillAnswer || answerText || (q.TrueFalseAnswer ? 'True' : ''));

    // Question metadata
    const metadata = {
      original_question_id: q.QuestionID,
      topic_id: q.TopicID,
      topic_name: q.TopicName,
      priority: q.QuestionPeriority,
      chapter: chInfo.title
    };

    processedQuestions.push({
      _id: `q_global_gk_${q.QuestionID}`,
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
-- Seed General Knowledge Questions for PTB Class 1
-- Generated on ${new Date().toISOString()}

BEGIN;

-- Delete old seeds if any
DELETE FROM questions WHERE school_id = '__global__' AND id LIKE 'q_global_gk_%';

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
