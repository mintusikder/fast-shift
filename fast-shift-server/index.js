require('dotenv').config()
const express = require('express')
const app = express()
const cors = require("cors");
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
// Middleware
app.use(cors());
app.use(express.json());


// MongoDB connection URI from .env
const uri = process.env.MONGO_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
 try {
    await client.connect();
    const db = client.db("parcelDB");
    parcelCollection = db.collection("parcels");

    console.log(" Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}
run().catch(console.dir);
// POST /parcels - Add a new parcel
app.post('/parcels', async (req, res) => {
  try {
    const parcelData = req.body;
    // Insert to MongoDB
    const result = await parcelCollection.insertOne(parcelData);
    res.status(201).send({
      message: "Parcel saved successfully",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("Parcel Save Error:", err);
    res.status(500).send({ message: "Failed to save parcel", error: err });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
