const fs = require('fs');
const path = require('path');

const srcPath = '/Users/ali/Downloads/pts_complete_subject_data (6).json';
const outputDir = '/Users/ali/Desktop/EDUEXPLO/Eduplexo/data/questions';
const outputJsonPath = path.join(outputDir, 'ptb-inter2-computer.json');
const outputSqlPath = path.join(outputDir, 'seed_questions_computer_inter2.sql');

// Make sure output dir exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Database IDs resolved from current DB state
const CLASS_ID = 'gcls_inter2_global';
const CLASS_NAME = 'INTER 2';
const SUBJECT_ID = 'gsub_computer_ptb_global_inter2';
const SUBJECT_NAME = 'Computer Science';
const SYLLABUS = 'ptb';

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
    const chInfo = { id: topicRef, title: q.TopicName || `Chapter ${topicRef}` };
    
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
      _id: `q_global_comp2_${q.QuestionID}`,
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
-- Seed Computer Science Questions for PTB Class Inter 2
-- Generated on ${new Date().toISOString()}

BEGIN;

-- Delete old seeds if any
DELETE FROM questions WHERE school_id = '__global__' AND id LIKE 'q_global_comp2_%';

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
