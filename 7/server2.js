const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const path = require("path");

const uri = "mongodb://127.0.0.1:27017";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "enrollment.html"));
});

/* Insert enrollment details */
app.get("/insert", async (req, res) => {
  const { sid, name, course, duration, status } = req.query;

  if (!sid || !name || !course || !duration) {
    return res.send("Invalid Input");
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("enrollments");

    await collection.insertOne({
      student_id: sid,
      name,
      course_name: course,
      duration,
      status: status || "active",
    });

    res.send("Enrollment Stored Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* GET – display all active enrollments */
app.get("/active", async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("enrollments");

    const result = await collection.find({ status: "active" }).toArray();

    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* PUT – update enrollment status to completed (handled using GET) */
app.get("/updateStatus", async (req, res) => {
  const { sid, course } = req.query;

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("enrollments");

    await collection.updateOne(
      {
        $or: [{ student_id: sid }, { course_name: course }],
      },
      { $set: { status: "completed" } }
    );

    res.send("Enrollment Status Updated to Completed");
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
