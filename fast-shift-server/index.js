// --- ADJUSTED FULL SERVER CODE (Express + MongoDB + Firebase Admin) ---
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const admin = require("firebase-admin");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const stripe = Stripe(process.env.PAYMENT_KEY);
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require("./firebase-admin-key.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// MongoDB setup
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let parcelCollection, paymentCollection, userCollection, riderCollection;

// Firebase Token Verification Middleware
const verifyFbToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    console.error("Invalid Firebase token:", error.message);
    return res.status(403).send({ message: "Forbidden: Invalid token" });
  }
};
//verify Admin
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded?.email;
  if (!email) return res.status(403).send({ message: "Forbidden: No email" });

  try {
    const user = await userCollection.findOne({ email });
    if (!user || user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden: Not admin" });
    }
    next();
  } catch (err) {
    res.status(500).send({ message: "Server error in admin check" });
  }
};
//verify Rider
const verifyRider = async (req, res, next) => {
  const email = req.decoded?.email;
  if (!email) return res.status(403).send({ message: "Forbidden: No email" });

  try {
    const user = await userCollection.findOne({ email });
    if (!user || user.role !== "rider") {
      return res.status(403).send({ message: "Forbidden: Not admin" });
    }
    next();
  } catch (err) {
    res.status(500).send({ message: "Server error in admin check" });
  }
};

// Connect MongoDB
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

// --- ROUTES ---
app.get("/", (req, res) => res.send("Parcel API Server Running"));

// STRIPE PAYMENT ROUTES
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

app.post("/payments", async (req, res) => {
  const { parcelId, email, transactionId, amount, paymentMethod, paymentTime } = req.body;
  if (!parcelId || !email || !transactionId || !amount || !paymentMethod) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await paymentCollection.insertOne({
      parcelId: new ObjectId(parcelId),
      userEmail: email,
      transactionId,
      amount,
      paymentMethod,
      paymentTime: new Date(paymentTime || Date.now()),
    });
    await parcelCollection.updateOne({ _id: new ObjectId(parcelId) }, { $set: { payment_status: "paid" } });
    res.status(200).json({ message: "Payment recorded", insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to save payment info" });
  }
});

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

// PARCEL ROUTES
app.post("/parcels", async (req, res) => {
  try {
    const result = await parcelCollection.insertOne(req.body);
    res.status(201).json({ message: "Parcel created", insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create parcel" });
  }
});

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

app.get("/parcels/paid-not-collected", verifyFbToken, verifyAdmin, async (req, res) => {
  try {
    const parcels = await parcelCollection.find({
      payment_status: "paid",
      delivery_status: "not_collected",
    }).toArray();
    res.status(200).json(parcels);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/parcels/:id", async (req, res) => {
  try {
    const parcel = await parcelCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!parcel) return res.status(404).json({ error: "Parcel not found" });
    res.status(200).json(parcel);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parcel" });
  }
});

app.delete("/parcels/:id", verifyFbToken, verifyAdmin, async (req, res) => {
  try {
    const result = await parcelCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(result.deletedCount ? 200 : 404).json({ message: result.deletedCount ? "Deleted" : "Not found" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete parcel" });
  }
});

// USER ROUTES
app.post("/users", async (req, res) => {
  try {
    const existing = await userCollection.findOne({ email: req.body.email });
    if (existing) return res.status(200).send({ message: "User exists" });
    const result = await userCollection.insertOne(req.body);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to save user" });
  }
});

app.get("/users/role", async (req, res) => {
  try {
    const user = await userCollection.findOne({ email: req.query.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ role: user.role || "user" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/users/:email/role", verifyFbToken, verifyAdmin, async (req, res) => {
  try {
    const result = await userCollection.updateOne(
      { email: req.params.email },
      { $set: { role: req.body.role } }
    );
    res.status(result.matchedCount ? 200 : 404).json({ message: result.matchedCount ? "Role updated" : "User not found" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update role" });
  }
});

// RIDER ROUTES
app.post("/riders", verifyFbToken, async (req, res) => {
  try {
    const data = { ...req.body, status: "pending", createdAt: new Date() };
    const result = await riderCollection.insertOne(data);
    res.status(201).json({ message: "Rider applied", insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit rider application" });
  }
});

app.get("/riders/pending", verifyFbToken, verifyAdmin, async (req, res) => {
  try {
    const pendingRiders = await riderCollection.find({ status: "pending" }).toArray();
    res.json(pendingRiders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending riders" });
  }
});

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
    res.status(500).json({ error: "Failed to update rider" });
  }
});

app.get("/riders/active", verifyFbToken, verifyAdmin, async (req, res) => {
  try {
    const activeRiders = await riderCollection.find({ status: "active" }).toArray();
    res.status(200).json(activeRiders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active riders" });
  }
});

app.patch("/parcels/:id/assign", verifyFbToken, verifyAdmin, async (req, res) => {
  const parcelId = req.params.id;
  const { riderEmail } = req.body;

  try {
    const result = await parcelCollection.updateOne(
      { _id: new ObjectId(parcelId) },
      {
        $set: {
          assigned_rider: riderEmail,
          delivery_status: "assigned",
        },
      }
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to assign rider" });
  }
});

// GET pending delivery parcels for a specific rider
app.get("/rider/parcels", verifyFbToken, verifyRider, async (req, res) => {
  const riderEmail = req.query.email;
  console.log("Query email:", riderEmail);
  console.log("Decoded email:", req.decoded.email);

  if (!riderEmail || riderEmail !== req.decoded.email) {
    return res.status(403).json({ message: "Forbidden: Email mismatch" });
  }

  try {
    const pendingParcels = await parcelCollection.find({
      assigned_rider: riderEmail,
      delivery_status: { $in: ["assigned", "intransit"] },
    }).toArray();

    console.log("Pending parcels found:", pendingParcels.length);

    res.status(200).json(pendingParcels || []);
  } catch (error) {
    console.error("Error fetching rider parcels:", error);
    res.status(500).json({ error: "Failed to fetch parcels" });
  }
});


// PATCH /parcel/status/:id
app.patch("/parcel/status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updateData = { delivery_status: status };

    if (status === "intransit") {
      updateData.picked_at = new Date();
    }
    if (status === "delivered") {
      updateData.delivered_at = new Date();
    }

    const result = await parcelCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ success: true, status });
    } else {
      res.status(404).json({ success: false, message: "Parcel not found or already updated" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update parcel status" });
  }
});

//Completed delivered
app.get("/rider/completed-parcels", async (req, res) => {
  const riderEmail = req.query.email;

  if (!riderEmail) {
    return res.status(400).json({ error: "Rider email is required" });
  }

  try {
    // Get all parcels that are delivered by the rider
    const completedParcels = await parcelCollection.find({
      assigned_rider: riderEmail,
      delivery_status: "delivered",
    }).toArray();

    // Add earning and readable timestamps
    const parcelsWithEarnings = completedParcels.map((parcel) => {
      const deliveryCost = typeof parcel.cost === "object" ? parcel.cost.$numberInt || 0 : parcel.cost || 0;
      const numericCost = parseFloat(deliveryCost);
      const earning = +(numericCost * 0.3).toFixed(2); // 30% earnings

      return {
        _id: parcel._id,
        tracking_id: parcel.tracking_id,
        senderName: parcel.senderName,
        receiverName: parcel.receiverName,
        cost: numericCost,
        earning,
        delivery_status: parcel.delivery_status,
        assigned_rider: parcel.assigned_rider,
        picked_at: parcel.picked_at || null, // Optional field
        delivered_at: parcel.delivered_at || null, // Optional field
      };
    });

    res.status(200).json(parcelsWithEarnings);
  } catch (error) {
    console.error("Error fetching completed parcels:", error);
    res.status(500).json({ error: "Failed to fetch completed parcels" });
  }
});



// SEARCH USERS
app.get("/users/search", verifyFbToken, verifyAdmin, async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Email is required" });
  try {
    const users = await userCollection.find({ email: { $regex: email, $options: "i" } })
      .project({ email: 1, createdAt: 1, role: 1 })
      .limit(10).toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to search users" });
  }
});

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));