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

const serviceAccount = require("./firebase-admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//custom middlewares
const verifyFbToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unAuthorization access" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "unAuthorization access" });
  }
  //verify token
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(403).send({ message: "forbidden access" });
  }
};
async function run() {
  try {
    await client.connect();
    const db = client.db("parcelDB");
    parcelCollection = db.collection("parcels");
    paymentCollection = db.collection("payments");
    userCollection = db.collection("users");
    riderCollection = db.collection("rider")
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}
run().catch(console.dir);

// ================= ROUTES ===================

// 1. Stripe: Create Payment Intent
app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe PaymentIntent Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Stripe: Handle Payment Record
app.post("/payments", async (req, res) => {
  const { parcelId, email, transactionId, amount, paymentMethod, paymentTime } =
    req.body;

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
    console.error("Payment Record Error:", err);
    res.status(500).json({ error: "Failed to save payment info" });
  }
});

// 3. Get Payment History by Email
app.get("/payments", verifyFbToken, async (req, res) => {
  const email = req.query.email;
  console.log("Headers in Payment", req.headers);
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const payments = await paymentCollection
      .find({ userEmail: email })
      .sort({ paymentTime: -1 }) // latest first
      .toArray();

    res.status(200).json(payments);
  } catch (err) {
    console.error("Fetch Payments Error:", err);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
});

// 4. Get Parcel by ID
app.get("/parcels/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const parcel = await parcelCollection.findOne({ _id: new ObjectId(id) });

    if (!parcel) {
      return res.status(404).json({ error: "Parcel not found" });
    }

    res.status(200).json(parcel);
  } catch (error) {
    console.error("Parcel Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch parcel" });
  }
});

// 5. Create New Parcel
app.post("/parcels", async (req, res) => {
  try {
    const parcelData = req.body;

    const result = await parcelCollection.insertOne(parcelData);
    res.status(201).json({
      message: "Parcel created",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("Parcel Create Error:", err);
    res.status(500).json({ error: "Failed to create parcel" });
  }
});

// 6. Get Parcels by User Email
app.get("/parcels", verifyFbToken, async (req, res) => {
  const email = req.query.email;
  if (req.query.email !== email) {
    return res.status(403).send({ message: "forbidden access" });
  }
  if (!email) {
    return res.status(400).json({ error: "Email query is required" });
  }

  try {
    const parcels = await parcelCollection
      .find({ created_by: email })
      .sort({ creation_date: -1 })
      .toArray();

    res.status(200).json(parcels);
  } catch (err) {
    console.error("Fetch Parcels Error:", err);
    res.status(500).json({ error: "Failed to fetch parcels" });
  }
});

// 7. User data post (registration)
app.post("/users", async (req, res) => {
  const user = req.body;

  try {
    const existing = await userCollection.findOne({ email: user.email });
    if (existing) {
      return res.status(200).send({ message: "User already exists" });
    }
    const result = await userCollection.insertOne(user);
    res.status(201).send(result);
  } catch (error) {
    console.error("User Save Error:", error);
    res.status(500).send({ error: "Failed to save user" });
  }
});

// 8. Delete Parcel by ID
app.delete("/parcels/:id", async (req, res) => {
  const id = req.params.id;

  try {
    console.log("Attempting to delete parcel with ID:", id);

    const result = await parcelCollection.deleteOne({ _id: new ObjectId(id) });

    console.log("Delete result:", result);

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Parcel deleted", deletedCount: 1 });
    } else {
      res.status(404).json({ error: "Parcel not found", deletedCount: 0 });
    }
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

 // POST /riders
app.post("/riders", async (req, res) => {
  const data = req.body;
  data.status = "pending";
  data.createdAt = new Date();

  try {
    const result = await riderCollection.insertOne(data);
    res.status(201).json({
      message: "Rider application submitted",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("Failed to submit rider:", err);
    res.status(500).json({ error: "Failed to submit rider application" });
  }
});

//  GET /riders/pending
app.get("/riders/pending", async (req, res) => {
  try {
    const pendingRiders = await riderCollection
      .find({ status: "pending" })
      .toArray();
    res.json(pendingRiders);
  } catch (err) {
    console.error("Failed to fetch pending riders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  PATCH /riders/:id
app.patch("/riders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await riderCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    res.send({
      message: "Rider status updated",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Rider status update error:", err);
    res.status(500).json({ error: "Failed to update rider status" });
  }
});

//  GET all active riders
app.get("/riders/active", async (req, res) => {
  try {
    const activeRiders = await riderCollection.find({ status: "approved" }).toArray();
    res.send(activeRiders);
  } catch (error) {
    console.error("Failed to fetch active riders", error);
    res.status(500).send({ error: "Failed to fetch active riders" });
  }
});


// 9. Health Check
app.get("/", (req, res) => {
  res.send("Parcel API Server Running");
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
