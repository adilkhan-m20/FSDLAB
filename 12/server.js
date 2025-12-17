const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const path = require("path");

const uri = "mongodb://127.0.0.1:27017";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "exam.html"));
});

/* Insert student exam details */
app.get("/insert", async (req, res) => {
  const { sid, name, subject, marks } = req.query;
  const m = parseInt(marks);

  if (!sid || !name || !subject || isNaN(m)) {
    return res.send("Invalid Input");
  }

  const eligibility = m < 20 ? "Not Eligible" : "Eligible";

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("exam_students");

    await collection.insertOne({
      student_id: sid,
      name,
      subject,
      marks: m,
      eligibility_status: eligibility,
    });

    res.send("Student Exam Record Stored");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* GET – students who are not eligible */
app.get("/noteligible", async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("exam_students");

    const result = await collection
      .find({
        eligibility_status: "Not Eligible",
      })
      .toArray();

    res.send(result);
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
