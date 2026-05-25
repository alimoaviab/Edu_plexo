import mongoose, { Types } from "mongoose";

import { connectDb } from "../shared/db/connect";
import { hashPassword } from "../shared/auth/password";
import { SchoolModel } from "../shared/models/school.model";
import { UserModel } from "../shared/models/user.model";
import { AcademicYearModel } from "../shared/models/academic-year.model";
import { SubjectModel } from "../shared/models/subject.model";
import { ClassModel } from "../shared/models/class.model";
import { TeacherModel } from "../shared/models/teacher.model";
import { StudentModel } from "../shared/models/student.model";
import { TimetableModel } from "../shared/models/timetable.model";
import { AttendanceModel } from "../shared/models/attendance.model";
import { ExamModel } from "../shared/models/exam.model";
import { ResultModel } from "../shared/models/result.model";
import { HomeworkModel } from "../shared/models/homework.model";

const SCHOOL_ID = "eduplexo-demo-school";
const SCHOOL_CODE = "EDU-DEMO";
const SCHOOL_NAME = "Eduplexo Demo School";
const SCHOOL_EMAIL = "school@gmail.com";
const TEACHER_EMAIL = "teacher@gmail.con";
const STUDENT_EMAIL = "student@gmail.com";
const DEMO_PASSWORD = "Test@123";
const ACADEMIC_YEAR = "2025-2026";

const subjectCatalog = [
  { name: "English", code: "ENG" },
  { name: "Mathematics", code: "MATH" },
  { name: "Science", code: "SCI" },
  { name: "Urdu", code: "URD" },
  { name: "Islamiat", code: "ISL" },
  { name: "Social Studies", code: "SST" },
  { name: "Computer", code: "CS" },
  { name: "Physics", code: "PHY" },
  { name: "Chemistry", code: "CHEM" },
  { name: "Biology", code: "BIO" }
];

const teacherNames = [
  ["Adeel", "Khan"],
  ["Sadia", "Ahmed"],
  ["Hamza", "Ali"],
  ["Ayesha", "Malik"],
  ["Bilal", "Hussain"],
  ["Hira", "Yousaf"],
  ["Faisal", "Qureshi"],
  ["Nida", "Raza"],
  ["Imran", "Saeed"],
  ["Rabia", "Noor"],
  ["Kamran", "Iqbal"],
  ["Bushra", "Akram"],
  ["Adnan", "Siddiqui"],
  ["Farah", "Naz"],
  ["Asad", "Ali"],
  ["Kiran", "Abbasi"],
  ["Rizwan", "Ahmed"],
  ["Amna", "Riaz"],
  ["Shahzad", "Bhatti"],
  ["Mariam", "Shah"]
] as const;

const studentFirstNames = [
  "Ayaan",
  "Muhammad",
  "Hassan",
  "Usman",
  "Hamza",
  "Ali",
  "Bilal",
  "Arham",
  "Daniyal",
  "Zain",
  "Hadi",
  "Omer",
  "Abdullah",
  "Saad",
  "Areeb",
  "Aisha",
  "Fatima",
  "Hira",
  "Zainab",
  "Maryam",
  "Sana",
  "Laiba",
  "Noor",
  "Mahnoor",
  "Iqra"
];

const studentLastNames = [
  "Khan",
  "Ali",
  "Ahmed",
  "Hussain",
  "Malik",
  "Raza",
  "Saeed",
  "Qureshi",
  "Shah",
  "Riaz",
  "Nawaz",
  "Yousaf",
  "Farooq",
  "Iqbal",
  "Amin",
  "Bibi",
  "Noor",
  "Zahra",
  "Tariq",
  "Akram"
];

const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;
const timetableTimes = [
  ["08:00", "08:45"],
  ["08:45", "09:30"],
  ["09:30", "10:15"],
  ["10:30", "11:15"],
  ["11:15", "12:00"]
] as const;

function buildPhone(index: number): string {
  return `0300${String(1000000 + index).slice(1)}`;
}

function buildGuardianName(index: number): string {
  return [`Muhammad`, `Abdul`, `Khalid`, `Rashid`, `Tariq`, `Shahid`, `Nadeem`, `Javed`, `Aslam`, `Pervez`][index % 10] +
    ` ${["Khan", "Ali", "Ahmed", "Malik", "Raza", "Iqbal", "Saeed", "Shah", "Nawaz", "Amin"][Math.floor(index / 10) % 10]}`;
}

function buildStudentName(index: number): { first_name: string; last_name: string } {
  return {
    first_name: studentFirstNames[index % studentFirstNames.length],
    last_name: studentLastNames[Math.floor(index / studentFirstNames.length) % studentLastNames.length]
  };
}

function gradeFromPercentage(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

function recentWeekdays(count: number): Date[] {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (days.length < count) {
    cursor.setDate(cursor.getDate() - 1);
    const day = cursor.getDay();
    if (day === 0 || day === 6) {
      continue;
    }
    days.push(new Date(cursor));
  }

  return days.reverse();
}

async function clearDemoData() {
  await Promise.all([
    SchoolModel.deleteMany({ school_id: SCHOOL_ID }),
    UserModel.deleteMany({ school_id: SCHOOL_ID }),
    AcademicYearModel.deleteMany({ school_id: SCHOOL_ID }),
    SubjectModel.deleteMany({ school_id: SCHOOL_ID }),
    ClassModel.deleteMany({ school_id: SCHOOL_ID }),
    TeacherModel.deleteMany({ school_id: SCHOOL_ID }),
    StudentModel.deleteMany({ school_id: SCHOOL_ID }),
    TimetableModel.deleteMany({ school_id: SCHOOL_ID }),
    AttendanceModel.deleteMany({ school_id: SCHOOL_ID }),
    ExamModel.deleteMany({ school_id: SCHOOL_ID }),
    ResultModel.deleteMany({ school_id: SCHOOL_ID }),
    HomeworkModel.deleteMany({ school_id: SCHOOL_ID })
  ]);
}

async function main() {
  await connectDb();
  await clearDemoData();

  const school = await SchoolModel.create({
    school_id: SCHOOL_ID,
    name: SCHOOL_NAME,
    code: SCHOOL_CODE,
    contact_email: SCHOOL_EMAIL,
    contact_phone: "0300-1112223",
    address: "Main Campus, Karachi",
    admin_profile: {
      name: "School Admin",
      email: SCHOOL_EMAIL,
      phone: "0300-1112223"
    },
    domains: ["eduplexo.local"],
    status: "active",
    settings: {
      timezone: "Asia/Karachi",
      academic_year: ACADEMIC_YEAR,
      attendance_threshold: 70
    },
    usage: {
      users: 0,
      students: 0,
      storage_mb: 0
    }
  });

  const academicYear = await AcademicYearModel.create({
    school_id: SCHOOL_ID,
    year: ACADEMIC_YEAR,
    start_date: new Date("2025-04-01"),
    end_date: new Date("2026-03-31"),
    is_active: true,
    status: "active",
    description: "Primary demo academic year"
  });

  const [adminUser, teacherUser, studentUser] = await UserModel.create([
    {
      school_id: SCHOOL_ID,
      email: SCHOOL_EMAIL,
      password_hash: hashPassword(DEMO_PASSWORD),
      role: "admin",
      permissions: ["*"],
      profile: {
        first_name: "School",
        last_name: "Admin"
      },
      status: "active"
    },
    {
      school_id: SCHOOL_ID,
      email: TEACHER_EMAIL,
      password_hash: hashPassword(DEMO_PASSWORD),
      role: "teacher",
      profile: {
        first_name: teacherNames[0][0],
        last_name: teacherNames[0][1]
      },
      status: "active"
    },
    {
      school_id: SCHOOL_ID,
      email: STUDENT_EMAIL,
      password_hash: hashPassword(DEMO_PASSWORD),
      role: "student",
      profile: {
        first_name: "Demo",
        last_name: "Student"
      },
      status: "active"
    }
  ]);

  const subjects = await SubjectModel.insertMany(
    subjectCatalog.map((subject) => ({
      school_id: SCHOOL_ID,
      name: subject.name,
      code: subject.code,
      description: `${subject.name} for the demo school`,
      status: "active"
    }))
  );

  const teachers = await TeacherModel.insertMany(
    teacherNames.map((teacherName, index) => ({
      school_id: SCHOOL_ID,
      user_id: index === 0 ? teacherUser._id : undefined,
      employee_no: `EMP${String(index + 1).padStart(4, "0")}`,
      first_name: teacherName[0],
      last_name: teacherName[1],
      phone: buildPhone(index + 1),
      qualification: index % 2 === 0 ? "M.Ed" : "B.Ed",
      subject_ids: [subjects[index % subjects.length]._id, subjects[(index + 3) % subjects.length]._id],
      subjects: [subjects[index % subjects.length].name, subjects[(index + 3) % subjects.length].name],
      status: "active"
    }))
  );

  const classes = await ClassModel.insertMany(
    Array.from({ length: 20 }, (_, classIndex) => {
      const grade = Math.floor(classIndex / 2) + 1;
      const section = classIndex % 2 === 0 ? "A" : "B";
      const subjectIndexes = Array.from({ length: 5 }, (_, offset) => (classIndex + offset) % subjects.length);

      return {
        school_id: SCHOOL_ID,
        name: `Grade ${grade}-${section}`,
        code: `G${grade}${section}`,
        display_order: classIndex + 1,
        passing_percentage: 33,
        capacity: 30,
        academy_care_id: academicYear._id,
        subject_ids: subjectIndexes.map((subjectIndex) => subjects[subjectIndex]._id),
        subjects: subjectIndexes.map((subjectIndex) => ({
          name: subjects[subjectIndex].name,
          total_marks: 100,
          passing_marks: 33
        })),
        grade: String(grade),
        section,
        academic_year: ACADEMIC_YEAR,
        class_teacher_id: teachers[classIndex]._id,
        teacher_ids: [teachers[classIndex]._id],
        room_number: `R-${String(classIndex + 1).padStart(2, "0")}`,
        description: `Demo class for Grade ${grade}-${section}`,
        fee_structure: {
          total_annual: 60000,
          monthly_recurring: 5000,
          fees_configured: true
        },
        grade_thresholds: {
          A_PLUS: 90,
          A: 80,
          B: 70,
          C: 60,
          D: 50
        },
        status: "active"
      };
    })
  );

  const studentDocs = classes.flatMap((classDoc, classIndex) =>
    Array.from({ length: 25 }, (_, studentIndex) => {
      const globalIndex = classIndex * 25 + studentIndex;
      const name = buildStudentName(globalIndex);
      const isPrimaryStudent = globalIndex === 0;

      return {
        school_id: SCHOOL_ID,
        user_id: isPrimaryStudent ? studentUser._id : undefined,
        admission_no: `ADM-${String(globalIndex + 1).padStart(5, "0")}`,
        first_name: name.first_name,
        last_name: name.last_name,
        class_id: classDoc._id,
        subjects: classDoc.subjects.map((subject: { name: string }) => subject.name),
        section: classDoc.section,
        guardian: {
          name: buildGuardianName(globalIndex),
          phone: buildPhone(1000 + globalIndex),
          email: `guardian${globalIndex + 1}@example.com`
        },
        status: "active"
      };
    })
  );

  const students = await StudentModel.insertMany(studentDocs);

  const timetableRows = classes.flatMap((classDoc, classIndex) =>
    weekdays.flatMap((day, dayIndex) => {
      const subject = subjects[(classIndex + dayIndex) % subjects.length];
      const [startTime, endTime] = timetableTimes[dayIndex];

      return {
        school_id: SCHOOL_ID,
        class_id: classDoc._id,
        teacher_id: teachers[classIndex]._id,
        subject_id: subject._id,
        subject: subject.name,
        day_of_week: dayIndex + 1,
        day,
        period_number: dayIndex + 1,
        start_time: startTime,
        end_time: endTime,
        room: classDoc.room_number
      };
    })
  );

  await TimetableModel.insertMany(timetableRows);

  const attendanceDays = recentWeekdays(5);
  const attendanceRows = attendanceDays.flatMap((date) =>
    students.map((studentDoc, index) => ({
      school_id: SCHOOL_ID,
      student_id: studentDoc._id,
      class_id: studentDoc.class_id,
      date,
      status: index % 10 === 0 ? "absent" : index % 7 === 0 ? "late" : "present",
      marked_by: teacherUser._id,
      source: "manual",
      note: index % 10 === 0 ? "Demo absence" : index % 7 === 0 ? "Demo late arrival" : ""
    }))
  );

  await AttendanceModel.insertMany(attendanceRows);

  const exams = await ExamModel.insertMany(
    classes.map((classDoc, classIndex) => {
      const subjectIndexes = Array.from({ length: 5 }, (_, offset) => (classIndex + offset) % subjects.length);

      return {
        school_id: SCHOOL_ID,
        name: `Mid Term - ${classDoc.name}`,
        exam_type: "term",
        class_id: classDoc._id,
        teacher_id: teachers[classIndex]._id,
        class_ids: [classDoc._id],
        academic_year_id: academicYear._id,
        subject: "Combined",
        title: `${classDoc.name} Mid Term Examination`,
        starts_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        exam_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        max_marks: 500,
        pass_marks: 200,
        description: `Demo exam for ${classDoc.name}`,
        status: "results_published",
        published_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        results_published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        schedule: subjectIndexes.map((subjectIndex, slotIndex) => ({
          subject_id: subjects[subjectIndex]._id,
          class_id: classDoc._id,
          date: new Date(Date.now() - (7 - slotIndex) * 24 * 60 * 60 * 1000),
          start_time: timetableTimes[slotIndex][0],
          end_time: timetableTimes[slotIndex][1],
          hall: `Hall ${classIndex + 1}`
        }))
      };
    })
  );

  const resultRows = students.map((studentDoc, index) => {
    const exam = exams.find((examDoc) => String(examDoc.class_id) === String(studentDoc.class_id));
    if (!exam) {
      throw new Error(`Exam not found for class ${studentDoc.class_id}`);
    }

    const marks = 240 + ((index * 7) % 240);
    const percentage = (marks / 500) * 100;

    return {
      school_id: SCHOOL_ID,
      academic_year_id: academicYear._id,
      exam_id: exam._id,
      class_id: studentDoc.class_id,
      student_id: studentDoc._id,
      obtained_marks: marks,
      grade: gradeFromPercentage(percentage),
      remarks: percentage >= 75 ? "Excellent progress" : percentage >= 50 ? "Good effort" : "Needs improvement",
      graded_at: new Date()
    };
  });

  await ResultModel.insertMany(resultRows);

  const homeworkRows = classes.map((classDoc, classIndex) => {
    const subject = subjects[(classIndex + 2) % subjects.length];

    return {
      school_id: SCHOOL_ID,
      academic_year_id: academicYear._id,
      class_id: classDoc._id,
      teacher_id: teachers[classIndex]._id,
      subject_id: subject._id,
      subject: subject.name,
      title: `${classDoc.name} Weekly Practice`,
      instructions: `Complete the assigned exercises for ${subject.name}.`,
      attachment_urls: [],
      max_score: 100,
      submission_type: "both",
      assigned_at: new Date(),
      due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "assigned",
      submissions: []
    };
  });

  await HomeworkModel.insertMany(homeworkRows);

  await SchoolModel.updateOne(
    { _id: school._id },
    {
      $set: {
        usage: {
          users: 3 + teacherNames.length,
          students: students.length,
          storage_mb: 0
        },
        settings: {
          timezone: "Asia/Karachi",
          academic_year: ACADEMIC_YEAR,
          attendance_threshold: 70
        }
      }
    }
  );

  console.log("Demo data seeded successfully.");
  console.log(`School account: ${SCHOOL_EMAIL} / ${DEMO_PASSWORD}`);
  console.log(`Teacher account: ${TEACHER_EMAIL} / ${DEMO_PASSWORD}`);
  console.log(`Student account: ${STUDENT_EMAIL} / ${DEMO_PASSWORD}`);
  console.log(`Students created: ${students.length}`);
  console.log(`Teachers created: ${teachers.length}`);
  console.log(`Classes created: ${classes.length}`);
  console.log(`Attendance records: ${attendanceRows.length}`);
  console.log(`Exams created: ${exams.length}`);
  console.log(`Results created: ${resultRows.length}`);
  console.log(`Homework items: ${homeworkRows.length}`);
}

main()
  .catch((error) => {
    console.error("Demo data seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });