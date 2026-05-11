/**
 * Demo Data Seeding Script
 * 
 * Creates:
 * - 1 Admin user (admin@school.com / admin123)
 * - 20 Classes (Grade 1-10, Sections A & B)
 * - 20 Teachers
 * - 500 Students (distributed across classes)
 * - Attendance records
 * - Sample exams and results
 * 
 * Usage:
 * ts-node scripts/seed-demo-data.ts
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/eduplexo";

// Models (adjust paths as needed)
interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  school_id: string;
  phone?: string;
}

interface School {
  name: string;
  address: string;
  phone: string;
  email: string;
  principal: string;
}

interface Class {
  name: string;
  section: string;
  grade: number;
  capacity: number;
  school_id: string;
  teacher_id?: string;
}

interface Student {
  name: string;
  father_name: string;
  roll_number: string;
  class_id: string;
  school_id: string;
  date_of_birth: Date;
  gender: string;
  phone: string;
  address: string;
  status: string;
}

interface Teacher {
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  school_id: string;
  qualification: string;
}

// Pakistani names for realistic data
const boyNames = [
  "Muhammad Ali", "Ahmed Hassan", "Usman Khan", "Bilal Ahmed", "Hamza Ali",
  "Abdullah Shah", "Zain Abbas", "Faisal Mahmood", "Arslan Tariq", "Imran Malik",
  "Kamran Raza", "Shahzad Iqbal", "Adnan Siddiqui", "Fahad Hussain", "Rizwan Ahmed",
  "Asad Ali", "Junaid Khan", "Talha Mehmood", "Waqas Akram", "Yasir Arafat",
  "Omer Farooq", "Saad Bin", "Haris Rauf", "Daniyal Sheikh", "Rehan Aziz",
  "Shoaib Malik", "Kashif Abbasi", "Naveed Akhtar", "Salman Ahmad", "Tariq Jameel",
  "Waseem Akram", "Zahid Khan", "Babar Azam", "Fakhar Zaman", "Hasan Ali",
  "Imad Wasim", "Junaid Jamshed", "Kamran Akmal", "Misbah ul Haq", "Naseem Shah",
  "Qadir Khan", "Rameez Raja", "Sarfaraz Ahmed", "Umar Akmal", "Wahab Riaz",
  "Yasir Shah", "Azhar Ali", "Danish Kaneria", "Fawad Alam", "Hafeez Malik"
];

const girlNames = [
  "Fatima Khan", "Ayesha Ahmed", "Zainab Ali", "Maryam Hassan", "Aisha Malik",
  "Sana Tariq", "Hira Shahid", "Nida Yasmin", "Rabia Noor", "Sadia Iqbal",
  "Amna Riaz", "Bushra Akram", "Farah Naz", "Hina Butt", "Kiran Abbasi",
  "Laiba Fatima", "Mahnoor Sheikh", "Nimra Aslam", "Qurat ul Ain", "Rida Zahra",
  "Samina Bibi", "Tayyaba Gul", "Uzma Nawaz", "Warda Saleem", "Zara Yousaf",
  "Aliza Batool", "Beenish Akhtar", "Dua Zehra", "Esha Imran", "Fizza Arshad",
  "Gul Rukh", "Hafsa Siddiqui", "Iqra Aziz", "Javeria Abbasi", "Kinza Hashmi",
  "Lubna Faryad", "Mehwish Hayat", "Naimal Khawar", "Alizeh Shah", "Ramsha Khan",
  "Saboor Aly", "Tooba Siddiqui", "Urwa Hocane", "Veena Malik", "Yumna Zaidi",
  "Zarnish Khan", "Areeba Habib", "Dur e Fishan", "Hania Aamir", "Mawra Hocane"
];

const fatherNames = [
  "Muhammad Akram", "Abdul Rehman", "Khalid Mahmood", "Rashid Ali", "Tariq Aziz",
  "Shahid Iqbal", "Nadeem Abbas", "Javed Akhtar", "Aslam Khan", "Pervez Malik",
  "Zaheer Ahmed", "Nasir Hussain", "Saleem Raza", "Iftikhar Ahmad", "Ghulam Nabi",
  "Mushtaq Ahmed", "Rafiq Tarar", "Shaukat Hayat", "Tanvir Hussain", "Wajid Ali"
];

const subjects = [
  "Mathematics", "English", "Urdu", "Science", "Social Studies",
  "Islamiat", "Computer Science", "Physics", "Chemistry", "Biology",
  "Pakistan Studies", "Arabic", "Physical Education", "Art", "General Knowledge"
];

const teacherNames = [
  "Mr. Tariq Mahmood", "Mrs. Sadia Afzal", "Mr. Ahmed Ali", "Mrs. Fatima Noor",
  "Mr. Hassan Raza", "Mrs. Ayesha Khan", "Mr. Bilal Ahmed", "Mrs. Hina Butt",
  "Mr. Kamran Iqbal", "Mrs. Nida Yasmin", "Mr. Faisal Mehmood", "Mrs. Rabia Noor",
  "Mr. Imran Malik", "Mrs. Amna Riaz", "Mr. Adnan Siddiqui", "Mrs. Bushra Akram",
  "Mr. Rizwan Ahmed", "Mrs. Farah Naz", "Mr. Asad Ali", "Mrs. Kiran Abbasi"
];

// Helper functions
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generatePhone(): string {
  return `03${Math.floor(Math.random() * 900000000 + 100000000)}`;
}

async function seedData() {
  try {
    console.log("🚀 Starting data seeding...\n");

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get database
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection failed");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🗑️  Clearing existing demo data...");
    await db.collection("users").deleteMany({ email: { $regex: /@school\.com$/ } });
    await db.collection("schools").deleteMany({ name: "EduPlexo Demo School" });
    await db.collection("classes").deleteMany({});
    await db.collection("students").deleteMany({});
    await db.collection("teachers").deleteMany({});
    await db.collection("attendance").deleteMany({});
    console.log("✅ Cleared existing data\n");

    // 1. Create School
    console.log("🏫 Creating school...");
    const schoolResult = await db.collection("schools").insertOne({
      name: "EduPlexo Demo School",
      address: "123 Education Street, Karachi, Pakistan",
      phone: "021-12345678",
      email: "info@eduplexo.school",
      principal: "Dr. Muhammad Asif",
      established: "2010",
      created_at: new Date(),
      updated_at: new Date()
    });
    const schoolId = schoolResult.insertedId.toString();
    console.log(`✅ School created: ${schoolId}\n`);

    // 2. Create Admin User
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.collection("users").insertOne({
      name: "Admin User",
      email: "admin@school.com",
      password_hash: hashedPassword,
      role: "admin",
      school_id: schoolId,
      phone: "0300-1234567",
      status: "active",
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log("✅ Admin user created: admin@school.com / admin123\n");

    // 2.5. Create Academic Year
    console.log("📅 Creating academic year...");
    const academicYearResult = await db.collection("academic_years").insertOne({
      school_id: schoolId,
      name: "2025-2026",
      start_date: new Date("2025-01-01"),
      end_date: new Date("2025-12-31"),
      is_current: true,
      status: "active",
      created_at: new Date(),
      updated_at: new Date()
    });
    const academicYearId = academicYearResult.insertedId.toString();
    console.log(`✅ Academic year created: ${academicYearId}\n`);

    // 3. Create 20 Teachers
    console.log("👨‍🏫 Creating 20 teachers...");
    const teachers = [];
    for (let i = 0; i < 20; i++) {
      const teacher = {
        employee_no: `EMP${String(i + 1).padStart(4, "0")}`,
        first_name: teacherNames[i].split(" ")[0],
        last_name: teacherNames[i].split(" ").slice(1).join(" "),
        phone: generatePhone(),
        subjects: [randomItem(subjects), randomItem(subjects)],
        school_id: schoolId,
        qualification: randomItem(["B.Ed", "M.Ed", "M.A", "M.Sc", "B.A"]),
        status: "active",
        joined_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      };
      teachers.push(teacher);
    }
    const teachersResult = await db.collection("teachers").insertMany(teachers);
    const teacherIds = Object.values(teachersResult.insertedIds).map(id => id.toString());
    console.log(`✅ Created ${teacherIds.length} teachers\n`);

    // 4. Create 20 Classes (Grade 1-10, Sections A & B)
    console.log("📚 Creating 20 classes...");
    const classes = [];
    let classIndex = 0;
    for (let grade = 1; grade <= 10; grade++) {
      for (const section of ["A", "B"]) {
        const cls = {
          name: `Grade ${grade}-${section}`,
          section: section,
          grade: String(grade),
          capacity: 30,
          school_id: schoolId,
          academy_care_id: academicYearId,
          class_teacher_id: teacherIds[classIndex % teacherIds.length],
          status: "active",
          created_at: new Date(),
          updated_at: new Date()
        };
        classes.push(cls);
        classIndex++;
      }
    }
    const classesResult = await db.collection("classes").insertMany(classes);
    const classIds = Object.values(classesResult.insertedIds).map(id => id.toString());
    console.log(`✅ Created ${classIds.length} classes\n`);

    // 5. Create 500 Students (distributed across classes)
    console.log("👨‍🎓 Creating 500 students...");
    const students = [];
    const studentsPerClass = Math.floor(500 / classIds.length);
    
    let studentCount = 0;
    for (let classIdx = 0; classIdx < classIds.length; classIdx++) {
      const classId = classIds[classIdx];
      const classInfo = classes[classIdx];
      
      for (let i = 0; i < studentsPerClass; i++) {
        studentCount++;
        const isBoy = Math.random() > 0.5;
        const studentName = isBoy ? randomItem(boyNames) : randomItem(girlNames);
        
        const student = {
          name: studentName,
          father_name: randomItem(fatherNames),
          roll_number: `${classInfo.grade}${classInfo.section}${String(i + 1).padStart(3, "0")}`,
          class_id: classId,
          school_id: schoolId,
          date_of_birth: randomDate(new Date(2008, 0, 1), new Date(2018, 11, 31)),
          gender: isBoy ? "Male" : "Female",
          phone: generatePhone(),
          address: `House ${Math.floor(Math.random() * 500) + 1}, Street ${Math.floor(Math.random() * 50) + 1}, Karachi`,
          status: "active",
          created_at: new Date(),
          updated_at: new Date()
        };
        students.push(student);
        
        if (studentCount >= 500) break;
      }
      if (studentCount >= 500) break;
    }
    
    const studentsResult = await db.collection("students").insertMany(students);
    const studentIds = Object.values(studentsResult.insertedIds);
    console.log(`✅ Created ${students.length} students\n`);

    // 6. Create Attendance Records (for today)
    console.log("📋 Creating attendance records...");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendanceRecords = [];
    for (let i = 0; i < studentIds.length; i++) {
      const isPresent = Math.random() > 0.1; // 90% attendance rate
      attendanceRecords.push({
        student_id: studentIds[i],
        class_id: students[i].class_id,
        school_id: schoolId,
        date: today,
        status: isPresent ? "present" : "absent",
        marked_by: "system",
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    await db.collection("attendance").insertMany(attendanceRecords);
    console.log(`✅ Created ${attendanceRecords.length} attendance records\n`);

    // 7. Create Sample Exams
    console.log("📝 Creating sample exams...");
    const exams = [];
    for (let i = 0; i < 5; i++) {
      const exam = {
        name: `${["Mid-Term", "Final", "Monthly Test", "Quiz", "Annual"][i]} Examination`,
        school_id: schoolId,
        date: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000), // Next few weeks
        subjects: [
          { name: "Mathematics", total_marks: 100, passing_marks: 40 },
          { name: "English", total_marks: 100, passing_marks: 40 },
          { name: "Urdu", total_marks: 100, passing_marks: 40 },
          { name: "Science", total_marks: 100, passing_marks: 40 }
        ],
        status: "upcoming",
        created_at: new Date(),
        updated_at: new Date()
      };
      exams.push(exam);
    }
    
    await db.collection("exams").insertMany(exams);
    console.log(`✅ Created ${exams.length} exams\n`);

    // 8. Create Fee Records
    console.log("💰 Creating fee records...");
    const feeRecords = [];
    for (let i = 0; i < studentIds.length; i++) {
      const monthlyFee = 5000;
      const paid = Math.random() > 0.3 ? monthlyFee : Math.floor(Math.random() * monthlyFee);
      
      feeRecords.push({
        student_id: studentIds[i],
        school_id: schoolId,
        class_id: students[i].class_id,
        monthly_fee: monthlyFee,
        paid: paid,
        pending: monthlyFee - paid,
        status: paid === monthlyFee ? "paid" : paid > 0 ? "partial" : "pending",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    await db.collection("fees").insertMany(feeRecords);
    console.log(`✅ Created ${feeRecords.length} fee records\n`);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DATA SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n📊 Summary:");
    console.log(`   🏫 Schools: 1`);
    console.log(`   👤 Admin Users: 1`);
    console.log(`   👨‍🏫 Teachers: ${teacherIds.length}`);
    console.log(`   📚 Classes: ${classIds.length}`);
    console.log(`   👨‍🎓 Students: ${students.length}`);
    console.log(`   📋 Attendance Records: ${attendanceRecords.length}`);
    console.log(`   📝 Exams: ${exams.length}`);
    console.log(`   💰 Fee Records: ${feeRecords.length}`);
    
    console.log("\n🔐 Login Credentials:");
    console.log(`   Email: admin@school.com`);
    console.log(`   Password: admin123`);
    
    console.log("\n✅ You can now login and test the chatbot!");
    console.log("   Try asking: 'How many students are there?'");
    console.log("   Try asking: 'Show me all classes'");
    console.log("   Try asking: 'What is today's attendance?'");
    console.log("\n");

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB\n");
  }
}

// Run the seeding
seedData()
  .then(() => {
    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
