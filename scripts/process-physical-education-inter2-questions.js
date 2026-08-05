const fs = require('fs');
const path = require('path');

const srcPath = '/Users/ali/Downloads/pts_complete_subject_data (21).json';
const outputDir = '/Users/ali/Desktop/EDUEXPLO/Eduplexo/data/questions';
const outputJsonPath = path.join(outputDir, 'ptb-inter2-physical-education.json');
const outputSqlPath = path.join(outputDir, 'seed_questions_physical_education_inter2.sql');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const CLASS_ID = 'gcls_inter2_global';
const CLASS_NAME = 'INTER 2';
const SUBJECT_ID = 'gsub_physical_education_ptb_global_inter2';
const SUBJECT_NAME = 'Physical Education';
const SYLLABUS = 'ptb';

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
  "6 کھیلوں کی افادیت": { id: "6", title: "Benefits of Sports" },
  "7.1 بیڈ منٹن": { id: "7.1", title: "Badminton" },
  "7.2 ٹیبل ٹینس": { id: "7.2", title: "Table Tennis" },
  "7.3 باسکٹ بال": { id: "7.3", title: "Basketball" },
  "7.4 ہاکی": { id: "7.4", title: "Hockey" },
  "8.1 لانگ جمپ": { id: "8.1", title: "Long Jump" },
  "8.2 نیزہ": { id: "8.2", title: "Javelin" },
  "8.3 ہائی جمپ": { id: "8.3", title: "High Jump" },
  "8.4 400 میٹر دوڑ": { id: "8.4", title: "400 Meter Race" },
  "8.5 اچھے کھلاڑی کے اوصاف": { id: "8.5", title: "Qualities of a Good Player" },
  "9 جسمانی نظام": { id: "9", title: "Physical System" },
  "10 خوراک اور غذا": { id: "10", title: "Food and Nutrition" },
  "11 منشیات اور ان کے اثرات": { id: "11", title: "Drugs and Their Effects" },
  "12 جنسی حفظان صحت": { id: "12", title: "Sexual Health" },
  "13 ابتدائی طبی امداد": { id: "13", title: "First Aid" }
};

function cleanOptionText(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') 
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\r?\n|\r/g, ' ') 
    .replace(/\s+/g, ' ') 
    .trim();
}

function cleanHtmlText(html) {
  if (!html) return '';
  return html
    .replace(/\r?\n|\r/g, '\n') 
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
    
    const topicNameRaw = q.TopicName || '';
    let mappedTopic = topicMap[topicNameRaw];
    
    if (!mappedTopic) {
        mappedTopic = { id: q.TopicRef ? q.TopicRef.trim() : '1', title: topicNameRaw || ('Chapter ' + q.TopicRef) };
    }
    
    const questionHtml = cleanHtmlText(q.UrduQuestionDetails || q.EnglishQuestionDetails || '');
    
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
      _id: 'q_global_physical_ed_2_' + q.QuestionID,
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

console.log('Processed ' + processedQuestions.length + ' questions.');

fs.writeFileSync(outputJsonPath, JSON.stringify(processedQuestions, null, 2) + '\n');
console.log('Saved clean JSON to: ' + outputJsonPath);

let sqlContent = '-- Seed Physical Education Questions for PTB Class Inter 2\n-- Generated on ' + new Date().toISOString() + '\n\nBEGIN;\n\nDELETE FROM questions WHERE school_id = \'__global__\' AND id LIKE \'q_global_physical_ed_2_%\';\n\n';

processedQuestions.forEach(q => {
  const escapeSql = (str) => {
    if (!str) return "''";
    return "'" + str.replace(/'/g, "''") + "'";
  };

  sqlContent += 'INSERT INTO questions (\n' +
'  id, school_id, created_by, created_by_name, class_id, class_name,\n' +
'  subject_id, subject_name, chapter_id, chapter_name, type,\n' +
'  difficulty, question_html, options, answer, marks, metadata,\n' +
'  status, is_global, approval_status, created_at, updated_at\n' +
') VALUES (\n' +
'  ' + escapeSql(q._id) + ',\n' +
'  \'__global__\',\n' +
'  \'system\',\n' +
'  \'System Seed\',\n' +
'  ' + escapeSql(q.class_id) + ',\n' +
'  ' + escapeSql(q.class_name) + ',\n' +
'  ' + escapeSql(q.subject_id) + ',\n' +
'  ' + escapeSql(q.subject_name) + ',\n' +
'  ' + escapeSql(q.chapter_id) + ',\n' +
'  ' + escapeSql(q.chapter_name) + ',\n' +
'  ' + escapeSql(q.type) + ',\n' +
'  \'medium\',\n' +
'  ' + escapeSql(q.question_html) + ',\n' +
'  ' + escapeSql(JSON.stringify(q.options)) + ',\n' +
'  ' + escapeSql(q.answer) + ',\n' +
'  ' + q.marks + ',\n' +
'  ' + escapeSql(JSON.stringify(q.metadata)) + '::jsonb,\n' +
'  \'active\',\n' +
'  true,\n' +
'  \'approved\',\n' +
'  NOW(),\n' +
'  NOW()\n' +
') ON CONFLICT (id) DO UPDATE SET\n' +
'  question_html = EXCLUDED.question_html,\n' +
'  options = EXCLUDED.options,\n' +
'  answer = EXCLUDED.answer,\n' +
'  chapter_id = EXCLUDED.chapter_id,\n' +
'  chapter_name = EXCLUDED.chapter_name,\n' +
'  updated_at = NOW();\n\n';
});

sqlContent += 'COMMIT;\n';

fs.writeFileSync(outputSqlPath, sqlContent);
console.log('Saved SQL seed script to: ' + outputSqlPath);
console.log('Done!');
