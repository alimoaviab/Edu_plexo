import mongoose from "mongoose";
import crypto from "node:crypto";

// HARDCODED FALLBACK FOR DEV - matches .env.local
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://abdul:asdfasdf@cluster0.p5exv3z.mongodb.net/?appName=Cluster0";
const SCHOOL_ID = process.env.SCHOOL_ID || "dev-school-id"; // Match development school ID
const ACADEMIC_YEAR_LABEL = process.env.ACADEMIC_YEAR || "2025-2026";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "new1@school.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Requested dataset sizes
const CLASS_COUNT = Number(process.env.CLASS_COUNT || 20);
const TEACHER_COUNT = Number(process.env.TEACHER_COUNT || 25);
const STUDENT_COUNT = Number(process.env.STUDENT_COUNT || 500);

const SUBJECTS = [
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

const WEEK_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const PERIODS = [
    { start_time: "08:00", end_time: "09:00" },
    { start_time: "09:00", end_time: "10:00" },
    { start_time: "10:00", end_time: "11:00" },
    { start_time: "11:00", end_time: "12:00" },
    { start_time: "12:00", end_time: "13:00" }
];
const ATTENDANCE_STATUSES = ["present", "present", "present", "late", "absent"];

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
}

function buildPhone(index) {
    return `0300${String(index).padStart(7, "0")}`;
}

function buildEmail(prefix, index) {
    return `${prefix}${index}@school.local`;
}

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

async function bulkWriteIfNeeded(model, ops) {
    if (ops.length === 0) return;
    try {
        await model.bulkWrite(ops);
    } catch (err) {
        console.error(`Bulk write failed for ${model.modelName}:`, err);
    }
}

async function main() {
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables or fallback.");
    }
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
        autoIndex: true,
        maxPoolSize: 10
    });
    console.log("Connected successfully. Starting seed process...");

    const schemaOptions = { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, versionKey: false };
    const tenantField = { type: String, required: true, index: true, immutable: true, trim: true };
    const requiredString = { type: String, required: true, trim: true };

    const academicYearSchema = new mongoose.Schema({
        school_id: tenantField,
        year: requiredString,
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        is_active: { type: Boolean, default: false, index: true },
        description: { type: String, trim: true, default: "" },
        status: { type: String, enum: ["draft", "active", "completed", "cancelled"], default: "draft", index: true }
    }, { ...schemaOptions, collection: "academic_years" });

    const subjectSchema = new mongoose.Schema({
        school_id: tenantField,
        name: requiredString,
        code: { type: String, trim: true },
        description: { type: String, trim: true },
        status: { type: String, enum: ["active", "inactive"], default: "active", index: true }
    }, { ...schemaOptions, collection: "subjects" });

    const classSchema = new mongoose.Schema({
        school_id: tenantField,
        name: requiredString,
        section: String,
        capacity: Number,
        teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", index: true },
        academic_year_id: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear", index: true },
        status: { type: String, enum: ["active", "inactive"], default: "active", index: true }
    }, { ...schemaOptions, collection: "classes" });

    const teacherSchema = new mongoose.Schema({
        school_id: tenantField,
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
        employee_no: requiredString,
        first_name: requiredString,
        last_name: { type: String, trim: true, default: "" },
        phone: requiredString,
        qualification: { type: String, trim: true, default: "" },
        subject_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject", index: true }],
        subjects: [{ type: String, trim: true }],
        class_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
        status: { type: String, enum: ["active", "inactive", "on_leave"], default: "active", index: true },
        joined_at: { type: Date, default: Date.now }
    }, { ...schemaOptions, collection: "teachers" });

    const userSchema = new mongoose.Schema({
        school_id: tenantField,
        email: { type: String, required: true, trim: true, lowercase: true },
        password_hash: requiredString,
        role: { type: String, enum: ["super_admin", "admin", "teacher", "parent"], required: true, index: true },
        permissions: [{ type: String, trim: true }],
        profile: {
            first_name: String,
            last_name: String,
            phone: String,
            avatar_url: String
        },
        status: { type: String, enum: ["active", "invited", "disabled", "locked"], default: "active", index: true },
        last_login_at: Date
    }, { ...schemaOptions, collection: "users" });

    const studentSchema = new mongoose.Schema({
        school_id: tenantField,
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
        admission_no: requiredString,
        roll_no: String,
        first_name: requiredString,
        last_name: { type: String, trim: true, default: "" },
        date_of_birth: Date,
        gender: { type: String, enum: ["male", "female", "other"], index: true },
        blood_group: String,
        class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", index: true },
        parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", index: true },
        address: {
            current: String,
            permanent: String
        },
        photo_url: String,
        status: { type: String, enum: ["active", "inactive", "graduated", "withdrawn"], default: "active", index: true },
        admission_date: { type: Date, default: Date.now }
    }, { ...schemaOptions, collection: "students" });

    const timetableSchema = new mongoose.Schema({
        school_id: tenantField,
        class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true, index: true },
        teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true, index: true },
        subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
        day_of_week: { type: String, enum: WEEK_DAYS, required: true, index: true },
        start_time: { type: String, required: true },
        end_time: { type: String, required: true },
        room_no: String
    }, { ...schemaOptions, collection: "timetable" });

    const attendanceSchema = new mongoose.Schema({
        school_id: tenantField,
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
        class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true, index: true },
        academic_year_id: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear", required: true, index: true },
        date: { type: Date, required: true, index: true },
        status: { type: String, enum: ["present", "absent", "late", "half_day"], required: true, index: true },
        remarks: String
    }, { ...schemaOptions, collection: "attendance" });

    const homeworkSchema = new mongoose.Schema({
        school_id: tenantField,
        class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true, index: true },
        subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
        teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true, index: true },
        title: requiredString,
        description: requiredString,
        due_date: { type: Date, required: true },
        total_marks: Number,
        status: { type: String, enum: ["assigned", "evaluated", "cancelled"], default: "assigned" }
    }, { ...schemaOptions, collection: "homework" });

    const examSchema = new mongoose.Schema({
        school_id: tenantField,
        academic_year_id: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear", required: true, index: true },
        name: requiredString,
        term: requiredString,
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        status: { type: String, enum: ["scheduled", "ongoing", "completed", "cancelled"], default: "scheduled" }
    }, { ...schemaOptions, collection: "exams" });

    const resultSchema = new mongoose.Schema({
        school_id: tenantField,
        exam_id: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true, index: true },
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
        class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true, index: true },
        subject_results: [{
            subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
            marks_obtained: Number,
            total_marks: Number,
            grade: String,
            remarks: String
        }],
        total_marks: Number,
        obtained_marks: Number,
        percentage: Number,
        grade: String,
        status: { type: String, enum: ["passed", "failed", "pending"], default: "pending" }
    }, { ...schemaOptions, collection: "results" });

    // Models initialization
    const AcademicYearModel = mongoose.models.AcademicYear || mongoose.model("AcademicYear", academicYearSchema);
    const SubjectModel = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
    const ClassModel = mongoose.models.Class || mongoose.model("Class", classSchema);
    const TeacherModel = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
    const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userSchema);
    const StudentModel = mongoose.models.Student || mongoose.model("Student", studentSchema);
    const TimetableModel = mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);
    const AttendanceModel = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
    const HomeworkModel = mongoose.models.Homework || mongoose.model("Homework", homeworkSchema);
    const ExamModel = mongoose.models.Exam || mongoose.model("Exam", examSchema);
    const ResultModel = mongoose.models.Result || mongoose.model("Result", resultSchema);

    // --- Seed Academic Year ---
    const academicYear = await AcademicYearModel.findOneAndUpdate(
        { school_id: SCHOOL_ID, year: ACADEMIC_YEAR_LABEL },
        {
            $set: {
                school_id: SCHOOL_ID,
                year: ACADEMIC_YEAR_LABEL,
                start_date: new Date(`${ACADEMIC_YEAR_LABEL.split("-")[0]}-04-01`),
                end_date: new Date(`${ACADEMIC_YEAR_LABEL.split("-")[1]}-03-31`),
                is_active: true,
                status: "active"
            }
        },
        { upsert: true, new: true }
    );

    // --- Seed Subjects ---
    const subjectOps = SUBJECTS.map(s => ({
        updateOne: {
            filter: { school_id: SCHOOL_ID, name: s.name },
            update: { $set: { ...s, school_id: SCHOOL_ID, status: "active" } },
            upsert: true
        }
    }));
    await bulkWriteIfNeeded(SubjectModel, subjectOps);
    const subjectDocs = await SubjectModel.find({ school_id: SCHOOL_ID }).lean();

    // --- Seed Teachers ---
    const teacherOps = [];
    const teacherUserOps = [];
    const passwordHash = hashPassword("teacher123");
    for (let i = 1; i <= TEACHER_COUNT; i += 1) {
        const employeeNo = `TCH-${String(i).padStart(4, "0")}`;
        const email = buildEmail("teacher", i);
        teacherUserOps.push({
            updateOne: {
                filter: { school_id: SCHOOL_ID, email },
                update: {
                    $set: {
                        school_id: SCHOOL_ID,
                        email,
                        password_hash: passwordHash,
                        role: "teacher",
                        permissions: ["attendance.*", "homework.*", "exams.view", "results.manage"],
                        profile: { first_name: `Teacher ${i}`, last_name: "Lastname", phone: buildPhone(i) },
                        status: "active"
                    }
                },
                upsert: true
            }
        });

        teacherOps.push({
            updateOne: {
                filter: { school_id: SCHOOL_ID, employee_no: employeeNo },
                update: {
                    $set: {
                        school_id: SCHOOL_ID,
                        employee_no: employeeNo,
                        first_name: `Teacher ${i}`,
                        last_name: "Lastname",
                        phone: buildPhone(i),
                        status: "active"
                    }
                },
                upsert: true
            }
        });
    }
    await bulkWriteIfNeeded(UserModel, teacherUserOps);
    await bulkWriteIfNeeded(TeacherModel, teacherOps);
    const teacherDocs = await TeacherModel.find({ school_id: SCHOOL_ID }).lean();
    const teacherUserDocs = await UserModel.find({ school_id: SCHOOL_ID, role: "teacher" }).lean();
    for (let i = 0; i < teacherDocs.length; i += 1) {
        const user = teacherUserDocs.find(u => u.email === buildEmail("teacher", i + 1));
        if (user) await TeacherModel.findByIdAndUpdate(teacherDocs[i]._id, { $set: { user_id: user._id } });
    }

    // --- Seed Classes ---
    const classOps = [];
    for (let i = 1; i <= CLASS_COUNT; i += 1) {
        const name = `Class ${i}`;
        classOps.push({
            updateOne: {
                filter: { school_id: SCHOOL_ID, name },
                update: {
                    $set: {
                        school_id: SCHOOL_ID,
                        name,
                        section: "A",
                        capacity: 40,
                        academic_year_id: academicYear._id,
                        teacher_id: teacherDocs[i % teacherDocs.length]._id,
                        status: "active"
                    }
                },
                upsert: true
            }
        });
    }
    await bulkWriteIfNeeded(ClassModel, classOps);
    const classDocs = await ClassModel.find({ school_id: SCHOOL_ID }).lean();

    // --- Seed Students ---
    const studentOps = [];
    const studentUserOps = [];
    const studentPwdHash = hashPassword("student123");
    for (let i = 1; i <= STUDENT_COUNT; i += 1) {
        const admissionNo = `ADM-${String(i).padStart(6, "0")}`;
        const email = buildEmail("student", i);
        studentUserOps.push({
            updateOne: {
                filter: { school_id: SCHOOL_ID, email },
                update: {
                    $set: {
                        school_id: SCHOOL_ID,
                        email,
                        password_hash: studentPwdHash,
                        role: "student",
                        permissions: ["exams.view", "results.view", "homework.view"],
                        profile: { first_name: `Student ${i}`, last_name: "Lastname", phone: buildPhone(1000 + i) },
                        status: "active"
                    }
                },
                upsert: true
            }
        });

        studentOps.push({
            updateOne: {
                filter: { school_id: SCHOOL_ID, admission_no: admissionNo },
                update: {
                    $set: {
                        school_id: SCHOOL_ID,
                        admission_no: admissionNo,
                        roll_no: String(i),
                        first_name: `Student ${i}`,
                        last_name: "Lastname",
                        gender: i % 2 === 0 ? "male" : "female",
                        class_id: classDocs[i % classDocs.length]._id,
                        status: "active"
                    }
                },
                upsert: true
            }
        });
    }
    await bulkWriteIfNeeded(UserModel, studentUserOps);
    await bulkWriteIfNeeded(StudentModel, studentOps);
    const studentDocs = await StudentModel.find({ school_id: SCHOOL_ID }).lean();
    const studentUserDocs = await UserModel.find({ school_id: SCHOOL_ID, role: "student" }).lean();
    for (let i = 0; i < studentDocs.length; i += 1) {
        const user = studentUserDocs.find(u => u.email === buildEmail("student", i + 1));
        if (user) await StudentModel.findByIdAndUpdate(studentDocs[i]._id, { $set: { user_id: user._id } });
    }

    // --- Seed Timetable ---
    const timetableOps = [];
    classDocs.forEach(cls => {
        WEEK_DAYS.forEach(day => {
            PERIODS.forEach((period, pIdx) => {
                timetableOps.push({
                    updateOne: {
                        filter: { school_id: SCHOOL_ID, class_id: cls._id, day_of_week: day, start_time: period.start_time },
                        update: {
                            $set: {
                                school_id: SCHOOL_ID,
                                class_id: cls._id,
                                teacher_id: teacherDocs[(pIdx + cls.name.length) % teacherDocs.length]._id,
                                subject_id: subjectDocs[pIdx % subjectDocs.length]._id,
                                day_of_week: day,
                                start_time: period.start_time,
                                end_time: period.end_time,
                                room_no: `Room ${100 + (pIdx % 10)}`
                            }
                        },
                        upsert: true
                    }
                });
            });
        });
    });
    await bulkWriteIfNeeded(TimetableModel, timetableOps);

    // --- Seed Attendance: last 5 working days ---
    const attendanceDates = [];
    for (let i = 1; i <= 5; i += 1) attendanceDates.push(addDays(new Date(), -i));
    const attendanceOps = [];
    studentDocs.forEach(student => {
        attendanceDates.forEach(date => {
            attendanceOps.push({
                updateOne: {
                    filter: { school_id: SCHOOL_ID, student_id: student._id, date: { $gte: new Date(date.setHours(0,0,0,0)), $lte: new Date(date.setHours(23,59,59,999)) } },
                    update: {
                        $set: {
                            school_id: SCHOOL_ID,
                            student_id: student._id,
                            class_id: student.class_id,
                            academic_year_id: academicYear._id,
                            date,
                            status: ATTENDANCE_STATUSES[Math.floor(Math.random() * ATTENDANCE_STATUSES.length)]
                        }
                    },
                    upsert: true
                }
            });
        });
    });
    await bulkWriteIfNeeded(AttendanceModel, attendanceOps);

    // --- Seed Homework ---
    const homeworkOps = [];
    classDocs.forEach(cls => {
        subjectDocs.slice(0, 3).forEach((sub, sIdx) => {
            homeworkOps.push({
                updateOne: {
                    filter: { school_id: SCHOOL_ID, class_id: cls._id, subject_id: sub._id, title: `Homework ${sIdx + 1}` },
                    update: {
                        $set: {
                            school_id: SCHOOL_ID,
                            class_id: cls._id,
                            subject_id: sub._id,
                            teacher_id: cls.teacher_id,
                            title: `Auto-seeded Homework ${sIdx + 1}`,
                            description: "Please complete the exercises from the textbook.",
                            due_date: addDays(new Date(), 2 + sIdx),
                            total_marks: 10,
                            status: "assigned"
                        }
                    },
                    upsert: true
                }
            });
        });
    });
    await bulkWriteIfNeeded(HomeworkModel, homeworkOps);

    // --- Seed Exams and Results ---
    const exam = await ExamModel.findOneAndUpdate(
        { school_id: SCHOOL_ID, name: "Mid-Term Examination" },
        {
            $set: {
                school_id: SCHOOL_ID,
                academic_year_id: academicYear._id,
                name: "Mid-Term Examination",
                term: "Mid-Term",
                start_date: addDays(new Date(), -30),
                end_date: addDays(new Date(), -20),
                status: "completed"
            }
        },
        { upsert: true, new: true }
    );

    const examOps = [];
    const resultOps = [];
    studentDocs.forEach((student, idx) => {
        const subjectResults = subjectDocs.slice(0, 5).map(sub => ({
            subject_id: sub._id,
            marks_obtained: 60 + Math.floor(Math.random() * 40),
            total_marks: 100,
            grade: "A",
            remarks: "Good"
        }));
        const totalObtained = subjectResults.reduce((sum, r) => sum + r.marks_obtained, 0);
        const totalMax = subjectResults.length * 100;
        const percentage = (totalObtained / totalMax) * 100;

        resultOps.push({
            updateOne: {
                filter: { school_id: SCHOOL_ID, exam_id: exam._id, student_id: student._id },
                update: {
                    $set: {
                        school_id: SCHOOL_ID,
                        exam_id: exam._id,
                        student_id: student._id,
                        class_id: student.class_id,
                        subject_results: subjectResults,
                        total_marks: totalMax,
                        obtained_marks: totalObtained,
                        percentage,
                        grade: percentage >= 90 ? "A+" : (percentage >= 80 ? "A" : "B"),
                        status: "passed"
                    }
                },
                upsert: true
            }
        });
    });
    await bulkWriteIfNeeded(ResultModel, resultOps);

    // --- Seed Admin User ---
    const adminUser = await UserModel.findOneAndUpdate(
        { school_id: SCHOOL_ID, email: ADMIN_EMAIL },
        {
            $set: {
                school_id: SCHOOL_ID,
                email: ADMIN_EMAIL,
                password_hash: hashPassword(ADMIN_PASSWORD),
                role: "admin",
                permissions: ["*"],
                profile: { first_name: "School", last_name: "Administrator" },
                status: "active"
            }
        },
        { upsert: true, new: true }
    );

    // Seed test teacher and student for quick login
    const testTeacherUser = await UserModel.findOneAndUpdate(
        { school_id: SCHOOL_ID, email: "teacher@school.com" },
        {
            $set: {
                school_id: SCHOOL_ID,
                email: "teacher@school.com",
                password_hash: hashPassword("admin123"),
                role: "teacher",
                permissions: ["*"],
                profile: { first_name: "Test", last_name: "Teacher" },
                status: "active"
            }
        },
        { upsert: true, new: true }
    );

    const testStudentUser = await UserModel.findOneAndUpdate(
        { school_id: SCHOOL_ID, email: "student@school.com" },
        {
            $set: {
                school_id: SCHOOL_ID,
                email: "student@school.com",
                password_hash: hashPassword("admin123"),
                role: "student",
                permissions: ["*"],
                profile: { first_name: "Test", last_name: "Student" },
                status: "active"
            }
        },
        { upsert: true, new: true }
    );

    // --- Seed Fees: one invoice per student ---
    const FeeModel = mongoose.models.Fee || mongoose.model("Fee", new mongoose.Schema({}, { strict: false, collection: "fees" }));
    const feeOps = [];
    const currentMonth = new Date().toLocaleString('en-us', { month: 'long' }).toLowerCase();
    const currentYear = new Date().getFullYear();

    studentDocs.forEach((studentDoc, idx) => {
        const invoiceNo = `${SCHOOL_ID}-INV-${String(idx + 1).padStart(6, "0")}`;
        const amount = 500 + (idx % 10) * 25;
        feeOps.push({
            updateOne: {
                filter: { school_id: SCHOOL_ID, student_id: studentDoc._id, month: currentMonth, year: currentYear },
                update: {
                    $set: {
                        school_id: SCHOOL_ID,
                        student_id: studentDoc._id,
                        class_id: studentDoc.class_id,
                        academic_year_id: academicYear._id,
                        invoice_no: invoiceNo,
                        title: `Tuition Fee ${academicYear.year}`,
                        amount,
                        currency: "PKR",
                        month: currentMonth,
                        year: currentYear,
                        due_at: addDays(new Date(), 15 + (idx % 30)),
                        status: idx % 3 === 0 ? "paid" : "unpaid",
                        paid_amount: idx % 3 === 0 ? amount : 0,
                        generated_by: adminUser._id
                    }
                },
                upsert: true
            }
        });
    });
    await bulkWriteIfNeeded(FeeModel, feeOps);

    // --- Seed Behavior incidents ---
    const BehaviorModel = mongoose.models.Behavior || mongoose.model("Behavior", new mongoose.Schema({}, { strict: false, collection: "behavior" }));
    const behaviorOps = [];
    for (let i = 0; i < Math.min(100, studentDocs.length); i += 1) {
        const student = studentDocs[i];
        const teacher = teacherDocs[i % teacherDocs.length];
        behaviorOps.push({
            updateOne: {
                filter: { school_id: SCHOOL_ID, student_id: student._id, incident_type: "conduct" },
                update: {
                    $set: {
                        school_id: SCHOOL_ID,
                        student_id: student._id,
                        class_id: student.class_id,
                        teacher_id: teacher._id,
                        incident_type: "conduct",
                        description: `Auto-seeded incident ${i + 1}`,
                        severity: i % 4 === 0 ? "major" : "minor",
                        action_taken: "Counseling",
                        status: "open",
                        warning_count: 1,
                        parent_notified: false
                    }
                },
                upsert: true
            }
        });
    }
    await bulkWriteIfNeeded(BehaviorModel, behaviorOps);

    // --- Seed Leaves ---
    const LeaveModel = mongoose.models.Leave || mongoose.model("Leave", new mongoose.Schema({}, { strict: false, collection: "leaves" }));
    const leaveOps = [];
    for (let i = 0; i < Math.min(30, studentDocs.length); i += 1) {
        const student = studentDocs[i];
        leaveOps.push({
            updateOne: {
                filter: { school_id: SCHOOL_ID, requester_type: "student", requester_id: student._id, start_date: addDays(new Date(), i + 3) },
                update: {
                    $set: {
                        school_id: SCHOOL_ID,
                        requester_type: "student",
                        requester_id: student._id,
                        requester_name: `${student.first_name || "Student"} ${student.last_name || ""}`.trim(),
                        leave_type: "sick",
                        reason: "Auto-seeded student leave",
                        start_date: addDays(new Date(), i + 3),
                        end_date: addDays(new Date(), i + 4),
                        status: "pending"
                    }
                },
                upsert: true
            }
        });
    }
    await bulkWriteIfNeeded(LeaveModel, leaveOps);

    console.log(
        `Seeded ${CLASS_COUNT} classes, ${TEACHER_COUNT} teachers, ${SUBJECTS.length} subjects, ${STUDENT_COUNT} students, ${classDocs.length * WEEK_DAYS.length * PERIODS.length} timetable entries, ${studentDocs.length * attendanceDates.length} attendance records, ${homeworkOps.length} homework items, ${examOps.length} exams, ${resultOps.length} results, ${feeOps.length} fees, ${behaviorOps.length} behavior incidents, ${leaveOps.length} leaves for ${SCHOOL_ID}.`
    );

    await mongoose.disconnect();
}

main().catch(async (error) => {
    console.error("Seed failed:", error);
    try {
        await mongoose.disconnect();
    } catch {
        // ignore disconnect errors
    }
    process.exit(1);
});
