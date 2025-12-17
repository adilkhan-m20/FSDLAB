const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const uri = "mongodb://127.0.0.1:27017";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "internship.html"));
});

/* Insert internship details */
app.get("/insert", async (req, res) => {
  const { sid, name, company, duration, status } = req.query;

  if (!sid || !name || !company || !duration) {
    return res.send("Invalid Input");
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("internships");

    await collection.insertOne({
      student_id: sid,
      name,
      company,
      duration,
      status: status || "Ongoing",
    });

    res.send("Internship Details Stored");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* GET – students interning at Infosys */
app.get("/infosys", async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("internships");

    const result = await collection.find({ company: "Infosys" }).toArray();

    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* PUT – update internship status (handled using GET for lab) */
app.get("/updateStatus", async (req, res) => {
  const { id } = req.query;

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("internships");

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "Completed" } }
    );

    res.send("Internship Status Updated to Completed");
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
