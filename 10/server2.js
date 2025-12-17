const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const path = require("path");

const uri = "mongodb://127.0.0.1:27017";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "startup.html"));
});

/* Insert startup idea */
app.get("/insert", async (req, res) => {
  const { id, team, title, domain, funding } = req.query;
  const fund = parseFloat(funding);

  if (!id || !team || !title || !domain || isNaN(fund)) {
    return res.send("Invalid Input");
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("startups");

    await collection.insertOne({
      startup_id: id,
      team_name: team,
      title,
      domain,
      funding_required: fund,
    });

    res.send("Startup Idea Stored Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* GET – EdTech startups with funding > 5 lakhs */
app.get("/edtech", async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("startups");

    const result = await collection
      .find({
        domain: "EdTech",
        funding_required: { $gt: 500000 },
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
