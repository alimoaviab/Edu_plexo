const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/Users/butt/Desktop/eduplexo/1.json', 'utf8'));

console.log('Total entries:', data.length);

const subjectIds = new Set();
const questionTypes = new Set();
const topics = {};

let totalQuestions = 0;

data.forEach(entry => {
  questionTypes.add(entry._questionType);
  if (entry.QuestionsList) {
    entry.QuestionsList.forEach(q => {
      totalQuestions++;
      if (q.SubjectID) subjectIds.add(q.SubjectID);
      const topicRef = q.TopicRef || 'unknown';
      if (!topics[topicRef]) {
        topics[topicRef] = new Set();
      }
      if (q.TopicName) {
        topics[topicRef].add(q.TopicName);
      }
    });
  }
});

console.log('Subject IDs:', Array.from(subjectIds));
console.log('Question Types:', Array.from(questionTypes));
console.log('Total Questions:', totalQuestions);
console.log('Topics Map:');
Object.keys(topics).sort().forEach(ref => {
  console.log(`  "${ref}": "${Array.from(topics[ref]).join(' | ')}"`);
});
