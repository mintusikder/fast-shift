require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB setup
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Global collection reference
let parcelCollection;

async function run() {
  try {
    await client.connect();
    const db = client.db("parcelDB");
    parcelCollection = db.collection("parcels");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}
run().catch(console.dir);

// POST /parcels - Create a new parcel
app.post("/parcels", async (req, res) => {
  try {
    const parcelData = req.body;
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

// GET /parcels?email=xyz@example.com - Fetch parcels by email, latest first
app.get("/parcels", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ error: "Email query is required" });
    }

    const parcels = await parcelCollection
      .find({ created_by: email })
      .sort({ creation_date: -1 })
      .toArray();

    res.status(200).json(parcels);
  } catch (error) {
    console.error("Fetch Parcel Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//delete a parcel
const { ObjectId } = require("mongodb");

app.delete("/parcels/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await parcelCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res
        .status(200)
        .json({ message: "Parcel deleted successfully", deletedCount: 1 });
    } else {
      res.status(404).json({ error: "Parcel not found", deletedCount: 0 });
    }
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Parcel API Server Running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
