
import { listSubjects } from "./shared/services/subject.service";
import { connectDb } from "./shared/db/connect";

async function test() {
    await connectDb();
    const ctx = { school_id: "67ced9c585d852cc0599a093", role: "admin", user_id: "67ced9c585d852cc0599a08e" }; // Example IDs from other files or typical ones
    const subjects = await listSubjects(ctx as any);
    console.log("Subjects:", JSON.stringify(subjects, null, 2));
    process.exit(0);
}

test();
