require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const admin = require("firebase-admin");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const stripe = Stripe(process.env.PAYMENT_KEY);
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

let parcelCollection, paymentCollection, userCollection, riderCollection;

const serviceAccount = require("./firebase-admin-key.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// Firebase Token Verification Middleware
const verifyFbToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ message: "Unauthorized access" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(403).send({ message: "Forbidden access" });
  }
};

// Admin Role Verification Middleware
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded?.email;
  if (!email) return res.status(401).send({ message: "Unauthorized user" });

  const user = await userCollection.findOne({ email });
  if (!user || user.role !== "admin") {
    return res.status(403).send({ message: "Forbidden: Admins only" });
  }
  next();
};

async function run() {
  try {
    await client.connect();
    const db = client.db("parcelDB");
    parcelCollection = db.collection("parcels");
    paymentCollection = db.collection("payments");
    userCollection = db.collection("users");
    riderCollection = db.collection("rider");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}
run().catch(console.dir);

// ============== ROUTES ==============

// Stripe: Create Payment Intent
app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stripe: Record Payment
app.post("/payments", async (req, res) => {
  const { parcelId, email, transactionId, amount, paymentMethod, paymentTime } = req.body;

  if (!parcelId || !email || !transactionId || !amount || !paymentMethod) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const paymentDoc = {
      parcelId: new ObjectId(parcelId),
      userEmail: email,
      transactionId,
      amount,
      paymentMethod,
      paymentTime: new Date(paymentTime || Date.now()),
    };

    const result = await paymentCollection.insertOne(paymentDoc);
    await parcelCollection.updateOne(
      { _id: new ObjectId(parcelId) },
      { $set: { payment_status: "paid" } }
    );

    res.status(200).json({
      message: "Payment recorded & parcel updated",
      insertedId: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save payment info" });
  }
});

// Get Payment History
app.get("/payments", verifyFbToken, async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const payments = await paymentCollection.find({ userEmail: email }).sort({ paymentTime: -1 }).toArray();
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
});

// Create Parcel
app.post("/parcels", async (req, res) => {
  try {
    const parcelData = req.body;
    const result = await parcelCollection.insertOne(parcelData);
    res.status(201).json({ message: "Parcel created", insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create parcel" });
  }
});

// Get Parcel by ID
app.get("/parcels/:id", async (req, res) => {
  try {
    const parcel = await parcelCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!parcel) return res.status(404).json({ error: "Parcel not found" });
    res.status(200).json(parcel);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parcel" });
  }
});

// Get User's Parcels
app.get("/parcels", verifyFbToken, async (req, res) => {
  const email = req.query.email;
  if (!email || email !== req.decoded.email) return res.status(403).send({ message: "Forbidden access" });

  try {
    const parcels = await parcelCollection.find({ created_by: email }).sort({ creation_date: -1 }).toArray();
    res.status(200).json(parcels);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parcels" });
  }
});

// Delete Parcel
app.delete("/parcels/:id", verifyFbToken, verifyAdmin, async (req, res) => {
  try {
    const result = await parcelCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 1) res.status(200).json({ message: "Parcel deleted" });
    else res.status(404).json({ error: "Parcel not found" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Users: Register
app.post("/users", async (req, res) => {
  try {
    const existing = await userCollection.findOne({ email: req.body.email });
    if (existing) return res.status(200).send({ message: "User already exists" });
    const result = await userCollection.insertOne(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to save user" });
  }
});

// Users: Get Role
app.get("/users/role", async (req, res) => {
  try {
    const user = await userCollection.findOne({ email: req.query.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ role: user.role || "user" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Users: Change Role
app.patch("/users/:email/role", verifyFbToken, verifyAdmin, async (req, res) => {
  try {
    const result = await userCollection.updateOne(
      { email: req.params.email },
      { $set: { role: req.body.role } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: `User role updated to ${req.body.role}` });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user role" });
  }
});

// Riders: Apply
app.post("/riders", verifyFbToken, async (req, res) => {
  try {
    const data = { ...req.body, status: "pending", createdAt: new Date() };
    const result = await riderCollection.insertOne(data);
    res.status(201).json({ message: "Rider application submitted", insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit rider application" });
  }
});

// Riders: Get Pending
app.get("/riders/pending", verifyFbToken, verifyAdmin, async (req, res) => {
  try {
    const pendingRiders = await riderCollection.find({ status: "pending" }).toArray();
    res.status(200).json(pendingRiders);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Riders: Update Status
app.patch("/riders/:id", verifyFbToken, verifyAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const rider = await riderCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!rider) return res.status(404).json({ error: "Rider not found" });

    await riderCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status } }
    );

    if (status === "active") {
      await userCollection.updateOne({ email: rider.email }, { $set: { role: "rider" } });
    }

    res.status(200).json({ message: "Rider status updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update rider status" });
  }
});

// Riders: Get Active
app.get("/riders/active", verifyFbToken, verifyAdmin, async (req, res) => {
  try {
    const activeRiders = await riderCollection.find({ status: "active" }).toArray();
    res.status(200).json(activeRiders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active riders" });
  }
});

// Health Check
app.get("/", (req, res) => {
  res.send("Parcel API Server Running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});