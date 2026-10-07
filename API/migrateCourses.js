import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "./config.env") });

async function runMigration() {
    console.log("=================================================");
    console.log("🚀 Starting Course Separation & Schema Migration");
    console.log("=================================================");

    const mongoUri = process.env.DATA_BASE || "mongodb://127.0.0.1:27017/RokadCollage";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB:", mongoUri);

    const db = mongoose.connection.db;

    // Check collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (!collectionNames.includes("courses")) {
        console.log("⚠️ Old 'courses' collection not found. Skipping course document migration.");
    } else {
        const oldCoursesColl = db.collection("courses");
        const inPersonColl = db.collection("inpersoncourses");
        const virtualColl = db.collection("virtualcourses");

        const oldCourses = await oldCoursesColl.find({}).toArray();
        console.log(`\n📦 Found ${oldCourses.length} documents in legacy 'courses' collection.`);

        let inPersonMigrated = 0;
        let inPersonSkipped = 0;
        let virtualMigrated = 0;
        let virtualSkipped = 0;

        for (const course of oldCourses) {
            const courseId = course._id;
            const courseType = course.type;

            if (courseType === "حضوری") {
                const existing = await inPersonColl.findOne({ _id: courseId });
                if (existing) {
                    inPersonSkipped++;
                } else {
                    const docToInsert = { ...course };
                    delete docToInsert.__v;
                    await inPersonColl.insertOne(docToInsert);
                    inPersonMigrated++;
                }
            } else if (courseType === "مجازی") {
                const existing = await virtualColl.findOne({ _id: courseId });
                if (existing) {
                    virtualSkipped++;
                } else {
                    const docToInsert = { ...course };
                    delete docToInsert.__v;
                    delete docToInsert.sprints;
                    delete docToInsert.location;

                    // Ensure spotplayerCourseId exists (generate 24-hex fallback if missing)
                    if (!docToInsert.spotplayerCourseId) {
                        docToInsert.spotplayerCourseId = courseId.toString();
                        console.log(
                            `  ℹ️ Virtual Course "${course.title}" (${courseId}) missing spotplayerCourseId. Fallback set to ${docToInsert.spotplayerCourseId}`
                        );
                    }

                    await virtualColl.insertOne(docToInsert);
                    virtualMigrated++;
                }
            } else {
                console.log(`  ⚠️ Unknown course type "${courseType}" for course "${course.title}" (${courseId}).`);
            }
        }

        console.log(`\n📊 Course Migration Summary:`);
        console.log(`  - InPersonCourses: ${inPersonMigrated} migrated, ${inPersonSkipped} skipped (already exists).`);
        console.log(`  - VirtualCourses:  ${virtualMigrated} migrated, ${virtualSkipped} skipped (already exists).`);
    }

    // Update Enrollments
    if (collectionNames.includes("enrollments")) {
        console.log("\n📦 Migrating 'enrollments' collection...");
        const enrollmentsColl = db.collection("enrollments");
        const inPersonColl = db.collection("inpersoncourses");
        const virtualColl = db.collection("virtualcourses");

        const enrollments = await enrollmentsColl.find({}).toArray();
        let enrollmentsUpdated = 0;
        let enrollmentsSkipped = 0;

        for (const enr of enrollments) {
            if (enr.courseModel) {
                enrollmentsSkipped++;
                continue;
            }

            let determinedModel = "InPersonCourse";
            const inPersonMatch = await inPersonColl.findOne({ _id: enr.course });
            if (inPersonMatch) {
                determinedModel = "InPersonCourse";
            } else {
                const virtualMatch = await virtualColl.findOne({ _id: enr.course });
                if (virtualMatch) {
                    determinedModel = "VirtualCourse";
                }
            }

            const updateFields = {
                courseModel: determinedModel,
            };

            // If virtual course and has no spotplayer subdocument, initialize it
            if (determinedModel === "VirtualCourse" && !enr.spotplayer) {
                updateFields.spotplayer = {
                    licenseId: null,
                    key: null,
                    url: null,
                    status: "pending",
                };
            }

            await enrollmentsColl.updateOne(
                { _id: enr._id },
                { $set: updateFields }
            );
            enrollmentsUpdated++;
        }

        console.log(`📊 Enrollment Migration Summary:`);
        console.log(`  - ${enrollmentsUpdated} updated with courseModel, ${enrollmentsSkipped} already had courseModel.`);
    }

    // Update Comments
    if (collectionNames.includes("comments")) {
        console.log("\n📦 Migrating 'comments' collection...");
        const commentsColl = db.collection("comments");
        const inPersonColl = db.collection("inpersoncourses");
        const virtualColl = db.collection("virtualcourses");

        const comments = await commentsColl.find({}).toArray();
        let commentsUpdated = 0;
        let commentsSkipped = 0;

        for (const comm of comments) {
            if (comm.courseModel) {
                commentsSkipped++;
                continue;
            }

            let determinedModel = "InPersonCourse";
            const inPersonMatch = await inPersonColl.findOne({ _id: comm.course });
            if (inPersonMatch) {
                determinedModel = "InPersonCourse";
            } else {
                const virtualMatch = await virtualColl.findOne({ _id: comm.course });
                if (virtualMatch) {
                    determinedModel = "VirtualCourse";
                }
            }

            await commentsColl.updateOne(
                { _id: comm._id },
                { $set: { courseModel: determinedModel } }
            );
            commentsUpdated++;
        }

        console.log(`📊 Comment Migration Summary:`);
        console.log(`  - ${commentsUpdated} updated with courseModel, ${commentsSkipped} already had courseModel.`);
    }

    console.log("\n🔒 NOTE: Legacy 'courses' collection has NOT been deleted. It should be manually reviewed and removed after validation.");
    console.log("=================================================");
    console.log("🎉 Migration completed successfully!");
    console.log("=================================================");

    await mongoose.disconnect();
}

runMigration().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
