const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const path = require("path");

const uri = "mongodb://127.0.0.1:27017";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "employee.html"));
});

/* Insert employee details */
app.get("/insert", async (req, res) => {
  const { name, email, phone, hiredate, job, salary } = req.query;
  const sal = parseInt(salary);

  if (!name || !email || !phone || !hiredate || !job) {
    return res.send("Invalid Input");
  }

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("HR");
    const collection = db.collection("employees");

    await collection.insertOne({
      emp_name: name,
      email: email,
      phone: phone,
      hire_date: hiredate,
      job_title: job,
      salary: sal,
    });

    res.send("Employee Record Inserted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* Display employees with salary > 50000 */
app.get("/highsalary", async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("HR");
    const collection = db.collection("employees");

    const result = await collection.find({ salary: { $gt: 50000 } }).toArray();

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
