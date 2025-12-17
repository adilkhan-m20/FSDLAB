const express = require("express");
const app = express();

/* Home route */
app.get("/", (req, res) => {
  res.send(`
    <h2>Engineering College Branches</h2>
    <ul>
      <li><a href="/cse">Computer Science</a></li>
      <li><a href="/ece">Electronics</a></li>
      <li><a href="/mech">Mechanical</a></li>
    </ul>
  `);
});

/* CSE branch */
app.get("/cse", (req, res) => {
  res.send(`
    <body style="background-color:lightblue; font-family:Arial;">
      <h1>Computer Science Engineering</h1>
      <p>Focus on programming, AI, Data Science.</p>
    </body>
  `);
});

/* ECE branch */
app.get("/ece", (req, res) => {
  res.send(`
    <body style="background-color:lightgreen; font-family:Verdana;">
      <h1>Electronics and Communication Engineering</h1>
      <p>Focus on circuits, communication systems.</p>
    </body>
  `);
});

/* Mechanical branch */
app.get("/mech", (req, res) => {
  res.send(`
    <body style="background-color:lightyellow; font-family:'Times New Roman';">
      <h1>Mechanical Engineering</h1>
      <p>Focus on machines, thermodynamics.</p>
    </body>
  `);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
