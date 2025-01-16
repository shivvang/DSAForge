import Review from "../models/Review.model.js";
import { sendMail } from "../utils/email.js"; 

// 🚀 How the F* is MongoDB Doing This?**

// "If my document is getting automatically deleted (via TTL), then how does MongoDB still have access to it before it's gone?"

// MongoDB is a beast when it comes to handling changes. Here's the sexy algorithm behind it:

// **🔹 Step 1: MongoDB’s Oplog (Operation Log)
// MongoDB has an internal log of every operation happening in the database. This log is called the Oplog (Operation Log).

// 💡 Think of it like this:
// Whenever ANYTHING happens (insert, update, delete), MongoDB writes it down first in this log before actually making the change.

// 🔹 Step 2: ChangeStream Reads from Oplog
// ChangeStream listens to this Oplog in real-time.

// When a delete operation is about to happen, MongoDB first logs it in the Oplog.
// The ChangeStream listener picks up this log entry.
// If we specify { fullDocument: "before" }, MongoDB attaches a snapshot of the document before deletion.

// 🔹 Step 3: MongoDB TTL Deletes the Document
// MongoDB deletes the document AFTER ChangeStream has seen it.
// That's why your ChangeStream still has access to the full document even though it's deleted immediately after.

// 🔍 Why Does fullDocument: "before" Work?
// Because MongoDB is smart AF 🧠.

// It knows that when a delete operation happens, ChangeStream listeners might need a copy of the document before it disappears.
// So, when we add { fullDocument: "before" }, MongoDB does this:

// 1️⃣ Sees a delete request
// 2️⃣ Copies the document (before actually deleting)
// 3️⃣ Sends that copy to ChangeStream
// 4️⃣ Deletes the document from MongoDB

// So, this happens BEFORE MongoDB actually deletes the document.
// 🚀 And that’s why fullDocument: "before" lets you access deleted documents.

// 🔥 Why is ChangeStream So Fast at Detecting Deletes?

// "How the f*** does ChangeStream even know that a delete operation is happening?"

// Answer:
// ✅ Because it's hooked directly into MongoDB’s core engine.
// ✅ It listens to the Oplog, which is the first place where MongoDB writes changes before executing them.
// ✅ This makes it real-time! No delays, no polling, no bullshit.

// 🔥🔥 TL;DR (Summary)
// Question	Answer
// How does MongoDB know about deletes before they happen?	It writes changes in an Oplog before executing them.
// How does ChangeStream access deleted documents?	It reads from Oplog and stores a copy before the delete happens.
// Why does fullDocument: "before" work?	MongoDB temporarily saves a copy before deletion and sends it to ChangeStream.
// How fast is ChangeStream?	Real-time, because it listens to Oplog directly inside MongoDB’s engine.
// 🔥 Final Thought
// 👉 MongoDB is doing all this magic in the background automatically!
// 👉 You don’t have to write extra code. Just use { fullDocument: "before" }, and MongoDB will do the heavy lifting.




const changeStream = Review.watch([
    { $match: { operationType: 'delete' }}// Watch for delete operations
    ,{ fullDocument: "before" }   // 👈 This captures the document before deletion
]);

changeStream.on('change', async (change) => {
    try {

      const reviewProblem = await Review.findById(change.fullDocument._id).populate("user problem");

      console.log("review problem we got here",reviewProblem);

        // Send email notification to the user
        const subject = "Reminder: Time to Review Problem";
        const body = {
            problemTitle: problem.title,
            problemDescription: problem.description,
        };

    } catch (error) {
        console.error("Error handling review deletion:", error);
    }
});
