const fs = require('fs');
const path = require('path');

const srcPath = '/Users/ali/Downloads/pts_complete_subject_data (19).json';
const outputDir = '/Users/ali/Desktop/EDUEXPLO/Eduplexo/data/questions';
const outputJsonPath = path.join(outputDir, 'ptb-inter2-punjabi.json');
const outputSqlPath = path.join(outputDir, 'seed_questions_punjabi_inter2.sql');

// Make sure output dir exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Database IDs resolved from current DB state
const CLASS_ID = 'gcls_inter2_global';
const CLASS_NAME = 'INTER 2';
const SUBJECT_ID = 'gsub_punjabi_ptb_global_inter2';
const SUBJECT_NAME = 'Punjabi';
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

const topicMap = {
  "1 تصوف تے پنجابی زبان": { id: "n1", title: "Mysticism and Punjabi Language" },
  "2 زراعت کہانی": { id: "n2", title: "Agriculture Story" },
  "3 پتنگے": { id: "n3", title: "Butterflies" },
  "4 پچھلی پڑھائی": { id: "n4", title: "Previous Studies" },
  "5 پنجابی نثر دیاں ونڈاں": { id: "n5", title: "Types of Punjabi Prose" },
  "6 حبہ خاتون": { id: "n6", title: "Habba Khatoon" },
  "7 ریڈار کہانی": { id: "n7", title: "Radar Story" },
  "8 گھسمیلا چانن": { id: "n8", title: "Dim Light" },
  "9 پنجاب دیاں لوک رسماں": { id: "n9", title: "Folk Customs of Punjab" },
  "1 حمد": { id: "p1", title: "Hamd" },
  "2 نعت": { id: "p2", title: "Na'at" },
  "3 بول فرید": { id: "p3", title: "Bol Farid" },
  "4 کافیاں": { id: "p4", title: "Kafian" },
  "5 ابیات": { id: "p5", title: "Abiyat (Sultan Bahu)" },
  "6 کافی": { id: "p6", title: "Kafi (Syed Bhulleh Shah)" },
  "7 مقولہ شاعر": { id: "p7", title: "Maqola Sha'ir" },
  "8 کلام": { id: "p8", title: "Kalam" },
  "9 کافی": { id: "p9", title: "Kafi — Khawaja Ghulam Farid" },
  "10 چوبرگے": { id: "p10", title: "Chobargy" },
  "11 غزل": { id: "p11", title: "Ghazal — Allama Yaqoob Anwar" },
  "12 کلارکھ": { id: "p12", title: "Klarkh" },
  "13 سکے پاتر": { id: "p13", title: "Sakay Patar" },
  "14 غزل": { id: "p14", title: "Ghazal — Rauf Sheikh" },
  "15 غزل": { id: "p15", title: "Ghazal — Saleem Kashir" },
  "16 غزل": { id: "p16", title: "Ghazal — Dr. Anwar Rashid" },
  "17 غزل": { id: "p17", title: "Ghazal — Manzoor Wazeerabadi" },
  "18 ڈونگھے پانی": { id: "p18", title: "Deep Waters" },
  "19 غزل": { id: "p19", title: "Ghazal — Ali Muhammad Malook" },
  "20 غزل": { id: "p20", title: "Ghazal — Akram Majeed" },
  "21 متاں": { id: "p21", title: "Matan" },
  "22 تاریاں دا گیت": { id: "p22", title: "Song of the Stars" },
  "23 غالب دی غزل دا پنجابی ترجمہ": { id: "p23", title: "Punjabi Translation of Ghalib's Ghazal" }
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
    return;
  }

  const qList = entry.QuestionsList || [];
  qList.forEach(q => {
    questionCounter++;
    
    // Resolve chapter/topic
    const topicNameRaw = q.TopicName || '';
    const mappedTopic = topicMap[topicNameRaw] || { id: q.TopicRef ? q.TopicRef.trim() : '1', title: topicNameRaw || `Chapter ${q.TopicRef}` };
    
    // Clean Question HTML details
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

    const marks = defaultMarksMap[mappedType] || 1;
    const cleanAnswer = cleanOptionText(q.UrduFillAnswer || q.EnglishFillAnswer || answerText || (q.TrueFalseAnswer ? 'True' : ''));

    const metadata = {
      original_question_id: q.QuestionID,
      topic_id: q.TopicID,
      topic_name: q.TopicName,
      priority: q.QuestionPeriority,
      chapter: mappedTopic.title
    };

    processedQuestions.push({
      _id: `q_global_punjabi2_${q.QuestionID}`,
      school_id: '__global__',
      created_by: 'system',
      created_by_name: 'System Seed',
      class_id: CLASS_ID,
      class_name: CLASS_NAME,
      subject_id: SUBJECT_ID,
      subject_name: SUBJECT_NAME,
      chapter_id: mappedTopic.id,
      chapter_name: mappedTopic.title,
      chapter: mappedTopic.id,
      type: mappedType,
      difficulty: 'medium',
      question_html: questionHtml,
      options: options,
      answer: cleanAnswer,
      marks: marks,
      metadata: metadata,
      status: 'active',
      is_global: true,
      approval_status: 'approved'
    });
  });
});

console.log(`Processed ${processedQuestions.length} questions.`);

fs.writeFileSync(outputJsonPath, JSON.stringify(processedQuestions, null, 2) + '\n');
console.log(`Saved clean JSON to: ${outputJsonPath}`);

let sqlContent = `-- Seed Punjabi Questions for PTB Class Inter 2
-- Generated on ${new Date().toISOString()}

BEGIN;

DELETE FROM questions WHERE school_id = '__global__' AND id LIKE 'q_global_punjabi2_%';

`;

processedQuestions.forEach(q => {
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
