// REST API (Express + MongoDB) with a simple front end in /public
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
let students;

// READ all
app.get("/api/students", async (req, res) => {
  res.json(await students.find().toArray());
});

// CREATE
app.post("/api/students", async (req, res) => {
  const { name, course, marks } = req.body;
  if (!name || !course || marks === undefined) return res.status(400).json({ error: "name, course and marks are required" });
  const r = await students.insertOne({ name, course, marks: Number(marks) });
  res.status(201).json({ _id: r.insertedId, name, course, marks: Number(marks) });
});

// UPDATE
app.put("/api/students/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Invalid id" });
  const { name, course, marks } = req.body;
  const r = await students.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { name, course, marks: Number(marks) } });
  res.json({ updated: r.modifiedCount });
});

// DELETE
app.delete("/api/students/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Invalid id" });
  const r = await students.deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ deleted: r.deletedCount });
});

client.connect().then(() => {
  students = client.db("college").collection("students");
  app.listen(3000, () => console.log("Server running at http://localhost:3000"));
}).catch(err => console.error("MongoDB connection failed:", err.message));
