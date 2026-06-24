const fs = require('fs');
const path = require('path');

const srcPath = '/Users/ali/Downloads/pts_complete_subject_data (26).json';
const outputDir = '/Users/ali/Desktop/EDUEXPLO/Eduplexo/data/questions';
const outputJsonPath = path.join(outputDir, 'ptb-inter2-farsi.json');
const outputSqlPath = path.join(outputDir, 'seed_questions_farsi_inter2.sql');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const CLASS_ID = 'gcls_inter2_global';
const CLASS_NAME = 'INTER 2';
const SUBJECT_ID = 'gsub_farsi_ptb_global_inter2';
const SUBJECT_NAME = 'Persian (Farsi)';
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
  "1": { id: "1", title: "Hamd" },
  "2": { id: "2", title: "Na'at" },
  "3": { id: "3", title: "Ain al-Quzat Hamdaniؒ — Selected Letters" },
  "4": { id: "4", title: "Ruba'iyat of Abu Said Abu al-Khayr" },
  "5": { id: "5", title: "A Moment with Sheikh Abu Said Abu al-Khayrؒ" },
  "6": { id: "6", title: "O Bukhara, Rejoice" },
  "7": { id: "7", title: "The Just Amir Sabuktigin and the Doe" },
  "8": { id: "8", title: "The Wise and the Ignorant" },
  "9": { id: "9", title: "Advice of Qabus Namah" },
  "10": { id: "10", title: "Airport" },
  "11": { id: "11", title: "It is From Us That Falls Upon Us" },
  "12": { id: "12", title: "Rabi'ah al-Adawiyyah" },
  "13": { id: "13", title: "Sultan Qutb al-Din Aybak" },
  "14": { id: "14", title: "Mawlana Jalal al-Din Rumi" },
  "15": { id: "15", title: "Friendship of the Ignorant" },
  "16": { id: "16", title: "Flowers of the Rose Garden of Sa'di" },
  "17": { id: "17", title: "Role of Women in Cultural Progress of Islamic Society" },
  "18": { id: "18", title: "Ghazal" },
  "19": { id: "19", title: "Lata'if al-Tawa'if" },
  "20": { id: "20", title: "Air Pollution" },
  "21": { id: "21", title: "A Miser at the Station" },
  "22": { id: "22", title: "In Praise of Punjab" },
  "23": { id: "23", title: "Snake Charmer" },
  "24": { id: "24", title: "Allama Muhammad Iqbal" },
  "25": { id: "25", title: "Arise From Deep Slumber" },
  "26": { id: "26", title: "Kashmir and Pakistan" },
  "27": { id: "27", title: "Sain Soheli Sarkarؒ" },
  "28": { id: "28", title: "At the Hospital" },
  "29": { id: "29", title: "In the Crossroads of the World" },
  "g-1": { id: "g-1", title: "Grammar" }
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
    const match = topicNameRaw.match(/^(\d+)/);
    let topicNum = match ? match[1] : (q.TopicRef ? q.TopicRef.trim() : 'g-1');
    
    // If topic is strictly ". گرائمر" or similar string with no number
    if (!match && topicNameRaw.includes('گرائمر')) {
        topicNum = 'g-1';
    }
    
    let mappedTopic = topicMap[topicNum];
    
    if (!mappedTopic) {
        mappedTopic = { id: topicNum, title: topicNameRaw || ('Chapter ' + topicNum) };
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
      _id: 'q_global_farsi_2_' + q.QuestionID,
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

let sqlContent = '-- Seed Farsi Questions for PTB Class Inter 2\n-- Generated on ' + new Date().toISOString() + '\n\nBEGIN;\n\nDELETE FROM questions WHERE school_id = \'__global__\' AND id LIKE \'q_global_farsi_2_%\';\n\n';

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
