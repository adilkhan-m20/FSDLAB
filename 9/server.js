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
  const { username, branch, semester } = req.query;

  if (!username || !branch || !semester) {
    return res.send("Invalid Input");
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("students");

    await collection.insertOne({
      username,
      branch,
      semester: parseInt(semester),
    });

    res.send("Student Details Stored Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* GET – students of CSE branch in 6th semester */
app.get("/cse6", async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("students");

    const result = await collection
      .find({
        branch: "CSE",
        semester: 6,
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
