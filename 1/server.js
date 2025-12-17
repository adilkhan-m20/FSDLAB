const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const uri = "mongodb://127.0.0.1:27017";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "complaint.html"));
});

/* POST – submit a new complaint */
app.get("/addComplaint", async (req, res) => {
  const { username, issue } = req.query;

  if (!username || !issue) {
    return res.send("Invalid Input");
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("complaints");

    const complaint = {
      username,
      issue,
      status: "Pending",
    };

    await collection.insertOne(complaint);
    res.send("Complaint Registered Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* PUT – update complaint status */
app.get("/updateStatus", async (req, res) => {
  const { id, status } = req.query;

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("complaints");

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status } });

    res.send("Status Updated Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* GET – retrieve all pending complaints */
app.get("/pending", async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("complaints");

    const pendingComplaints = await collection
      .find({ status: "Pending" })
      .toArray();

    res.send(pendingComplaints);
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
