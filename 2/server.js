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
  const { name, usn, semester, fee } = req.query;
  const exam_fee = parseInt(fee);

  if (!name || !usn || !semester) {
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
      semester,
      exam_fee,
    });

    res.send("Student Details Inserted Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* Delete students who have not paid exam fee */
app.get("/deleteUnpaid", async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("students");

    const result = await collection.deleteMany({
      $or: [{ exam_fee: 0 }, { exam_fee: null }],
    });

    res.send(result.deletedCount + " unpaid students deleted");
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
