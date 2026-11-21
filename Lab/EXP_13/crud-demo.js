// MongoDB CRUD operations using the native Node.js driver
// Prerequisite: MongoDB running locally (mongodb://127.0.0.1:27017)  ->  npm install  ->  node crud-demo.js
const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const students = client.db("college").collection("students");
    await students.deleteMany({});                      // clean start

    // CREATE
    const ins = await students.insertOne({ name: "Asha", course: "BCA", marks: 88 });
    console.log("Inserted id:", ins.insertedId);
    await students.insertMany([
      { name: "Ravi",  course: "BSc",   marks: 76 },
      { name: "Meera", course: "BTech", marks: 91 }
    ]);

    // READ
    console.log("\nAll students:", await students.find().toArray());
    console.log("Marks > 80:", await students.find({ marks: { $gt: 80 } }).toArray());
    console.log("Sorted by marks desc:", await students.find().sort({ marks: -1 }).project({ _id: 0 }).toArray());
    console.log("Count:", await students.countDocuments());

    // UPDATE
    await students.updateOne({ name: "Ravi" }, { $set: { marks: 80 } });
    await students.updateMany({}, { $inc: { marks: 1 } });
    console.log("\nAfter update:", await students.find({}, { projection: { _id: 0 } }).toArray());

    // DELETE
    await students.deleteOne({ name: "Asha" });
    console.log("\nAfter delete:", await students.find({}, { projection: { _id: 0 } }).toArray());

    // AGGREGATE
    console.log("\nAverage marks:", await students.aggregate([{ $group: { _id: null, avg: { $avg: "$marks" } } }]).toArray());
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.close();
  }
}
main();
