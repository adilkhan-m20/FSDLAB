const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const path = require("path");

const uri = "mongodb://127.0.0.1:27017";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "attendance.html"));
});

/* Insert student attendance details */
app.get("/insert", async (req, res) => {
  const { sid, name, course, total, attended } = req.query;

  const totalClasses = parseInt(total);
  const classesAttended = parseInt(attended);

  if (
    !sid ||
    !name ||
    !course ||
    isNaN(totalClasses) ||
    isNaN(classesAttended)
  ) {
    return res.send("Invalid Input");
  }

  const attendancePercentage = (classesAttended / totalClasses) * 100;

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("attendance");

    await collection.insertOne({
      student_id: sid,
      name,
      course,
      total_attendance: totalClasses,
      classes_attended: classesAttended,
      attendance_percentage: attendancePercentage,
    });

    res.send("Attendance Record Stored Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* GET – students with attendance below 75% */
app.get("/below75", async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("attendance");

    const result = await collection
      .find({
        attendance_percentage: { $lt: 75 },
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
