const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const path = require("path");

const uri = "mongodb://127.0.0.1:27017";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "product.html"));
});

/* Insert product details */
app.get("/insert", async (req, res) => {
  const { pid, name, price, discount, stock } = req.query;

  const p = parseFloat(price);
  const d = parseFloat(discount);

  if (!pid || !name || isNaN(p) || isNaN(d)) {
    return res.send("Invalid Input");
  }

  const finalPrice = p - (p * d) / 100;

  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("products");

    await collection.insertOne({
      product_id: pid,
      name,
      price: p,
      discount: d,
      stock: parseInt(stock),
      final_price: finalPrice,
    });

    res.send("Product Inserted Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  } finally {
    if (client) await client.close();
  }
});

/* GET – products with Final_Price < 1000 */
app.get("/lowprice", async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db("weblab");
    const collection = db.collection("products");

    const result = await collection
      .find({ final_price: { $lt: 1000 } })
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
