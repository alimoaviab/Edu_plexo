const fs = require('fs');
const path = require('path');

const srcPath = '/Users/ali/Downloads/pts_complete_subject_data (20).json';
const outputDir = '/Users/ali/Desktop/EDUEXPLO/Eduplexo/data/questions';
const outputJsonPath = path.join(outputDir, 'ptb-inter2-islamiat-ikhtyari.json');
const outputSqlPath = path.join(outputDir, 'seed_questions_islamiat_ikhtyari_inter2.sql');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const CLASS_ID = 'gcls_inter2_global';
const CLASS_NAME = 'INTER 2';
const SUBJECT_ID = 'gsub_islamiat_ikhtyari_ptb_global_inter2';
const SUBJECT_NAME = 'Islamiat (Elective)';
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
  "1 تعارف مطالعہ قرآن، نزول وحی، تدوین قرآن مجید، حفاظت قرآن مجید": { id: "1", title: "Introduction — Quranic Study, Revelation, Compilation and Protection of Quran" },
  "2 سورۃ بقرہ رکوع: 1,2": { id: "2", title: "Surah Al-Baqarah Ruku: 1,2" },
  " 3 سورۃ بقرہ رکوع:3,4": { id: "3", title: "Surah Al-Baqarah Ruku: 3,4" },
  "4 سورۃ بقرہ رکوع: 5,6": { id: "4", title: "Surah Al-Baqarah Ruku: 5,6" },
  "5 سورۃ بقرہ رکوع: 7,8": { id: "5", title: "Surah Al-Baqarah Ruku: 7,8" },
  "6 سورۃ بقرہ رکوع: 9,10": { id: "6", title: "Surah Al-Baqarah Ruku: 9,10" },
  "7 سورۃ بقرہ رکوع: 11,12": { id: "7", title: "Surah Al-Baqarah Ruku: 11,12" },
  "8 سورۃ بقرہ رکوع: 13,14": { id: "8", title: "Surah Al-Baqarah Ruku: 13,14" },
  "9 سورۃ بقرہ رکوع: 15,16": { id: "9", title: "Surah Al-Baqarah Ruku: 15,16" },
  "10 سورۃ بقرہ رکوع: 17,18": { id: "10", title: "Surah Al-Baqarah Ruku: 17,18" },
  "11 سورۃ بقرہ رکوع: 19,20": { id: "11", title: "Surah Al-Baqarah Ruku: 19,20" },
  "3.1 تعارف حدیث، ضرورت واہمیت، جمع وتدوین کتب حدیث": { id: "3.1", title: "Introduction to Hadith, Necessity & Importance, Compilation of Books of Hadith" },
  "3.2. احادیث: 1,2,3,4": { id: "3.2", title: "Ahadith: 1,2,3,4" },
  "3.3 احادیث: 5,6,7,8": { id: "3.3", title: "Ahadith: 5,6,7,8" },
  "3.4 احادیث: 9,10,11,12": { id: "3.4", title: "Ahadith: 9,10,11,12" },
  "3.5 احادیث: 13,14,15,16": { id: "3.5", title: "Ahadith: 13,14,15,16" },
  "3.6 احادیث: 17,18,19,20": { id: "3.6", title: "Ahadith: 17,18,19,20" },
  "3.7 احادیث: 21,22,23,24": { id: "3.7", title: "Ahadith: 21,22,23,24" },
  "3.8 احادیث: 25,25,27,28": { id: "3.8", title: "Ahadith: 25,26,27,28" },
  "3.9 احادیث: 29,30,31,32": { id: "3.9", title: "Ahadith: 29,30,31,32" },
  "3.10 احادیث: 33,34,35,36": { id: "3.10", title: "Ahadith: 33,34,35,36" },
  "3.11 احادیث: 37,38,39,40,41,42": { id: "3.11", title: "Ahadith: 37,38,39,40,41,42" },
  "4.1 ماضی، مضارع، امر، نہی، واحد جمع اور مذکر مونث": { id: "4.1", title: "Past, Present, Imperative, Negative, Singular-Plural, Masculine-Feminine" }
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
    
    // Fix typo in raw data "3.8 احادیث: 25,25,27,28"
    if (topicNameRaw === "3.8 احادیث: 25,25,27,28") mappedTopic = { id: "3.8", title: "Ahadith: 25,26,27,28" };
    // Fix space prefix
    if (topicNameRaw === " 3 سورۃ بقرہ رکوع:3,4") mappedTopic = { id: "3", title: "Surah Al-Baqarah Ruku: 3,4" };
    
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
      _id: 'q_global_islamiat_ik_2_' + q.QuestionID,
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

let sqlContent = '-- Seed Islamiat Ikhtyari Questions for PTB Class Inter 2\n-- Generated on ' + new Date().toISOString() + '\n\nBEGIN;\n\nDELETE FROM questions WHERE school_id = \'__global__\' AND id LIKE \'q_global_islamiat_ik_2_%\';\n\n';

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
