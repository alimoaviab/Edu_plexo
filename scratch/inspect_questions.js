const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/Users/butt/Desktop/eduplexo/1.json', 'utf8'));

const examples = {};
data.forEach(entry => {
  const type = entry._questionType;
  if (!examples[type] && entry.QuestionsList && entry.QuestionsList.length > 0) {
    examples[type] = entry.QuestionsList[0];
  }
});

console.log(JSON.stringify(examples, null, 2));
