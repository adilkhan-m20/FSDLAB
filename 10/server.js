const express = require("express");
const app = express();

/* Logger Middleware */
function logger(req, res, next) {
  console.log(`Method: ${req.method}, URL: ${req.url}`);
  next();
}

/* Visitor Counter Middleware */
let visitCount = 0;
function visitCounter(req, res, next) {
  visitCount++;
  console.log(`Visitor Count: ${visitCount}`);
  next();
}

/* Use middleware */
app.use(logger);
app.use(visitCounter);

/* Route */
app.get("/", (req, res) => {
  res.send(`
    <h2>Welcome to the Website</h2>
    <p>Number of visits: ${visitCount}</p>
  `);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
