const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const path = require("path");

const uri = "mongodb://127.0.0.1:27017";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "student.html"));
});

/* Insert student details */
app.get("/insert", async (req, res) => {
  const { name, usn, dept, grade } = req.query;

  if (!name || !usn || !dept || !grade) {
    return res.send("Invalid Input");
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("students");

    await collection.insertOne({
      name,
      usn,
      department: dept,
      grade,
    });

    res.send("Student Record Inserted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* PUT – update grade by student name (handled using GET) */
app.get("/updateGrade", async (req, res) => {
  const { name, grade } = req.query;

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("students");

    await collection.updateOne({ name: name }, { $set: { grade: grade } });

    res.send("Grade Updated Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* GET – display all student records */
app.get("/view", async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("students");

    const students = await collection.find().toArray();
    res.send(students);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
