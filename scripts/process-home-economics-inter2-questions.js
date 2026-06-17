const fs = require('fs');
const path = require('path');

const srcPath = '/Users/ali/Downloads/pts_complete_subject_data (32).json';
const outputDir = '/Users/ali/Desktop/EDUEXPLO/Eduplexo/data/questions';
const outputJsonPath = path.join(outputDir, 'ptb-inter2-home-economics.json');
const outputSqlPath = path.join(outputDir, 'seed_questions_home_economics_inter2.sql');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const CLASS_ID = 'gcls_inter2_global';
const CLASS_NAME = 'INTER 2';
const SUBJECT_ID = 'gsub_home_economics_ptb_global_inter2';
const SUBJECT_NAME = 'Home Economics';
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

const topicMapByUrdu = {
  "غذا کی اہمیت": { id: "1", title: "Importance of Food" },
  "متوازن غذا": { id: "2", title: "Balanced Diet" },
  "غذائی ضروریات": { id: "3", title: "Nutritional Requirements" },
  "پروٹین": { id: "4", title: "Protein" },
  "کاربوہائیڈریٹ یا نشاستہ": { id: "5", title: "Carbohydrates" },
  "روغنیات یا چکنائی": { id: "6", title: "Fats and Oils" },
  "وٹامن یا حیاتین": { id: "7", title: "Vitamins" },
  "معدنی نمکیات": { id: "8", title: "Mineral Salts" },
  "فہرست طعام کی تربیت": { id: "9", title: "Menu Planning" },
  "اشیائے خوردنی کی خریداری": { id: "10", title: "Grocery Shopping" },
  "کھانا پکانے کے اصول و طریقے": { id: "11", title: "Principles and Methods of Cooking" },
  "کھانا پیش کرنے کے طریقے": { id: "12", title: "Methods of Serving Food" },
  "سلائی کے ابتدائی مراحل": { id: "13", title: "Basic Steps of Sewing" },
  "اچھی فٹنگ کےلیے مناسب ناپ کی اہمیت": { id: "14", title: "Importance of Proper Measurements for Good Fitting" },
  "ریشوں کے مطالعے کی اہمیت": { id: "15", title: "Importance of Study of Fibers" },
  "پارچہ بافی کے بنیادی طریقے": { id: "16", title: "Basic Methods of Weaving" },
  "کپڑوں کی منصوبہ بندی": { id: "17", title: "Clothing Planning" },
  "ذاتی زیبائش": { id: "18", title: "Personal Grooming" }
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
    
    let topicNameRaw = q.TopicName || '';
    let cleanTopic = topicNameRaw.replace(/^[\.\s]+/, '').trim();
    
    let mappedTopic = topicMapByUrdu[cleanTopic];
    
    if (!mappedTopic) {
        // Fallback if not perfectly matched
        let numFallback = '1';
        mappedTopic = { id: numFallback, title: topicNameRaw || 'Chapter 1' };
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
      _id: 'q_global_home_economics_2_' + q.QuestionID,
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

let sqlContent = '-- Seed Home Economics Questions for PTB Class Inter 2\n-- Generated on ' + new Date().toISOString() + '\n\nBEGIN;\n\nDELETE FROM questions WHERE school_id = \'__global__\' AND id LIKE \'q_global_home_economics_2_%\';\n\n';

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
