const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const path = require("path");

app.use(express.urlencoded({ extended: true }));

const uri = "mongodb://127.0.0.1:27017";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "hospital.html"));
});

/* Insert hospital details */
app.post("/insert", async (req, res) => {
  const { hid, name, location, total, occupied } = req.body;

  let client;
  try {
    client = await MongoClient.connect(uri);
    const db = client.db("weblab");
    const collection = db.collection("hospitals");

    await collection.insertOne({
      hospital_id: hid,
      name,
      location,
      total_beds: parseInt(total),
      occupied_beds: parseInt(occupied),
    });

    res.send("Hospital Details Stored");
  } finally {
    if (client) await client.close();
  }
});

/* GET – hospitals where available beds < 10 */
app.get("/lowbeds", async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri);
    const db = client.db("weblab");
    const collection = db.collection("hospitals");

    const result = await collection
      .find({
        $expr: {
          $lt: [{ $subtract: ["$total_beds", "$occupied_beds"] }, 10],
        },
      })
      .toArray();

    res.send(result);
  } finally {
    if (client) await client.close();
  }
});

/* POST – admit patient (increment occupied beds) */
app.post("/admit", async (req, res) => {
  const { hid } = req.body;

  let client;
  try {
    client = await MongoClient.connect(uri);
    const db = client.db("weblab");
    const collection = db.collection("hospitals");

    await collection.updateOne(
      { hospital_id: hid },
      { $inc: { occupied_beds: 1 } }
    );

    res.send("Patient Admitted Successfully");
  } finally {
    if (client) await client.close();
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
