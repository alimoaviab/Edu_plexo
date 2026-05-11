# 🌱 Demo Data Seeding Guide

**Complete realistic data for testing chatbot**

---

## 📊 What Will Be Created

### Summary:
- ✅ **1 School** - EduPlexo Demo School
- ✅ **1 Admin User** - admin@school.com / admin123
- ✅ **20 Teachers** - With subjects and contact info
- ✅ **20 Classes** - Grade 1-10, Sections A & B
- ✅ **500 Students** - Realistic Pakistani names
- ✅ **500 Attendance Records** - For today (90% present)
- ✅ **5 Sample Exams** - Upcoming exams
- ✅ **500 Fee Records** - With payment status

---

## 🚀 How to Run

### Step 1: Install Dependencies (if needed)

```bash
npm install bcryptjs mongoose
npm install --save-dev @types/bcryptjs ts-node
```

### Step 2: Set Environment Variable

```bash
# Make sure MongoDB is running
# Check .env.local has correct MongoDB URI
cat school-app/.env.local | grep MONGODB
```

Should show:
```
MONGODB_URI=mongodb://localhost:27017/eduplexo
```

### Step 3: Run Seeding Script

```bash
npm run seed:demo
```

**Or directly:**
```bash
ts-node scripts/seed-demo-data.ts
```

---

## 📋 Expected Output

```
🚀 Starting data seeding...

✅ Connected to MongoDB

🗑️  Clearing existing demo data...
✅ Cleared existing data

🏫 Creating school...
✅ School created: 6748a1b2c3d4e5f6g7h8i9j0

👤 Creating admin user...
✅ Admin user created: admin@school.com / admin123

👨‍🏫 Creating 20 teachers...
✅ Created 20 teachers

📚 Creating 20 classes...
✅ Created 20 classes

👨‍🎓 Creating 500 students...
✅ Created 500 students

📋 Creating attendance records...
✅ Created 500 attendance records

📝 Creating sample exams...
✅ Created 5 exams

💰 Creating fee records...
✅ Created 500 fee records

============================================================
🎉 DATA SEEDING COMPLETED SUCCESSFULLY!
============================================================

📊 Summary:
   🏫 Schools: 1
   👤 Admin Users: 1
   👨‍🏫 Teachers: 20
   📚 Classes: 20
   👨‍🎓 Students: 500
   📋 Attendance Records: 500
   📝 Exams: 5
   💰 Fee Records: 500

🔐 Login Credentials:
   Email: admin@school.com
   Password: admin123

✅ You can now login and test the chatbot!
   Try asking: 'How many students are there?'
   Try asking: 'Show me all classes'
   Try asking: 'What is today's attendance?'

👋 Disconnected from MongoDB
```

---

## 📚 Data Details

### 1. School
```json
{
  "name": "EduPlexo Demo School",
  "address": "123 Education Street, Karachi, Pakistan",
  "phone": "021-12345678",
  "email": "info@eduplexo.school",
  "principal": "Dr. Muhammad Asif",
  "established": "2010"
}
```

### 2. Admin User
```json
{
  "name": "Admin User",
  "email": "admin@school.com",
  "password": "admin123",
  "role": "admin",
  "phone": "0300-1234567"
}
```

### 3. Teachers (20)
```
Mr. Tariq Mahmood - Mathematics, Physics
Mrs. Sadia Afzal - Urdu, Islamiat
Mr. Ahmed Ali - Science, Chemistry
Mrs. Fatima Noor - English, Social Studies
... (16 more)
```

### 4. Classes (20)
```
Grade 1-A (30 capacity)
Grade 1-B (30 capacity)
Grade 2-A (30 capacity)
Grade 2-B (30 capacity)
...
Grade 10-A (30 capacity)
Grade 10-B (30 capacity)
```

### 5. Students (500)
**Realistic Pakistani names:**
- Boys: Muhammad Ali, Ahmed Hassan, Usman Khan, etc.
- Girls: Fatima Khan, Ayesha Ahmed, Zainab Ali, etc.

**Each student has:**
- Name
- Father's name
- Roll number (e.g., 1A001, 2B015)
- Class assignment
- Date of birth (age 8-16)
- Gender
- Phone number
- Address
- Status (active)

### 6. Attendance (500 records)
- Date: Today
- Status: 90% present, 10% absent
- Marked by: system

### 7. Exams (5)
```
1. Mid-Term Examination
2. Final Examination
3. Monthly Test
4. Quiz
5. Annual Examination
```

Each exam has:
- Mathematics (100 marks, 40 passing)
- English (100 marks, 40 passing)
- Urdu (100 marks, 40 passing)
- Science (100 marks, 40 passing)

### 8. Fee Records (500)
- Monthly fee: Rs. 5,000
- Status: 70% paid, 20% partial, 10% pending

---

## 🧪 Testing After Seeding

### Step 1: Login

```
URL: http://localhost:3000/auth/login
Email: admin@school.com
Password: admin123
```

### Step 2: Go to Admin Dashboard

```
URL: http://localhost:3000/admin/dashboard
```

### Step 3: Test Chatbot

**Try these queries:**

```
1. "How many students are there?"
   Expected: "Your school has 500 students..."

2. "Show me all classes"
   Expected: List of 20 classes

3. "What is today's attendance?"
   Expected: "450 students present (90%), 50 absent (10%)"

4. "How many teachers are there?"
   Expected: "Your school has 20 teachers..."

5. "Show me Grade 6-A students"
   Expected: List of ~25 students in Grade 6-A

6. "Which students are absent today?"
   Expected: List of ~50 absent students

7. "Show me upcoming exams"
   Expected: List of 5 exams

8. "Show me fee collection report"
   Expected: Total collected, pending amounts

9. "Who teaches Mathematics?"
   Expected: "Mr. Tariq Mahmood teaches Mathematics"

10. "What is the current period in Grade 6?"
    Expected: Current period based on time
```

---

## 🔄 Re-running the Script

### Clear and Re-seed

The script automatically clears existing demo data before seeding. Just run:

```bash
npm run seed:demo
```

### Keep Existing Data

If you want to keep existing data, comment out these lines in the script:

```typescript
// Comment out these lines:
// await db.collection("users").deleteMany({ email: { $regex: /@school\.com$/ } });
// await db.collection("schools").deleteMany({ name: "EduPlexo Demo School" });
// ... etc
```

---

## 🐛 Troubleshooting

### Issue 1: MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Start MongoDB
brew services start mongodb-community
# Or
mongod --dbpath /path/to/data
```

### Issue 2: ts-node Not Found

```
Error: ts-node: command not found
```

**Solution:**
```bash
npm install --save-dev ts-node
```

### Issue 3: bcryptjs Not Found

```
Error: Cannot find module 'bcryptjs'
```

**Solution:**
```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### Issue 4: Mongoose Not Found

```
Error: Cannot find module 'mongoose'
```

**Solution:**
```bash
npm install mongoose
```

---

## 📊 Database Collections

After seeding, you'll have these collections:

```
eduplexo
├── schools (1 document)
├── users (1 admin)
├── teachers (20 documents)
├── classes (20 documents)
├── students (500 documents)
├── attendance (500 documents)
├── exams (5 documents)
└── fees (500 documents)
```

---

## 🔍 Verify Data in MongoDB

### Using MongoDB Compass:

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `eduplexo`
4. Check collections

### Using MongoDB Shell:

```bash
mongosh

use eduplexo

# Count documents
db.students.countDocuments()  // Should be 500
db.classes.countDocuments()   // Should be 20
db.teachers.countDocuments()  // Should be 20

# View sample data
db.students.findOne()
db.classes.find().limit(5)
db.teachers.find().limit(5)

# Check admin user
db.users.findOne({ email: "admin@school.com" })
```

---

## 📝 Customization

### Change Number of Students

Edit `seed-demo-data.ts`:

```typescript
// Line ~200
const studentsPerClass = Math.floor(1000 / classIds.length); // Change 500 to 1000
```

### Change Number of Classes

Edit `seed-demo-data.ts`:

```typescript
// Line ~150
for (let grade = 1; grade <= 12; grade++) { // Change 10 to 12
  for (const section of ["A", "B", "C"]) { // Add "C"
    // ...
  }
}
```

### Add More Teachers

Edit `seed-demo-data.ts`:

```typescript
// Line ~120
for (let i = 0; i < 30; i++) { // Change 20 to 30
  // ...
}
```

---

## ✅ Success Checklist

After running the script:

- [ ] Script completed without errors
- [ ] Login works with admin@school.com / admin123
- [ ] Admin dashboard loads
- [ ] Chatbot is visible
- [ ] Chatbot responds to queries
- [ ] Data shows in responses (500 students, 20 classes, etc.)
- [ ] Attendance data shows
- [ ] Fee data shows
- [ ] Exam data shows

---

## 🎯 Summary

**What You Get:**
- ✅ Complete realistic school data
- ✅ 500 students with Pakistani names
- ✅ 20 classes (Grade 1-10)
- ✅ 20 teachers
- ✅ Attendance records
- ✅ Fee records
- ✅ Exam data
- ✅ Ready to test chatbot

**How to Use:**
```bash
# 1. Run seeding
npm run seed:demo

# 2. Login
Email: admin@school.com
Password: admin123

# 3. Test chatbot
"How many students are there?"
"Show me all classes"
"What is today's attendance?"
```

**Result:**
- 🎉 Fully populated database
- 🤖 Chatbot with real data
- 📊 Realistic testing environment

---

**Version:** 1.0.0  
**Date:** May 11, 2026  
**Status:** ✅ Ready to Use
