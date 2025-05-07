const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
import { Request, Response } from "express";

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json()); // Parses incoming JSON

/**
 * POST /register
 * Creates a new user in both authIdentifiers and diadem-pepsa collections.
 */
app.post("/register", async (req: Request, res: Response) => {
  const { uid, name, email, phone, password } = req.body;

  if (!uid || !email || !phone) {
    return res.status(400).json({ message: "UID, email, and phone are required." });
  }

  try {
    // Check if user already exists
    const existingAuth = await db.collection("authIdentifiers").doc(uid).get();
    if (existingAuth.exists) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Store auth info
    await db.collection("authIdentifiers").doc(uid).set({
      email,
      phone,
      password, // (Consider hashing this in production)
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Store user profile/data
    await db.collection("diadem-pepsa").doc(uid).set({
      name,
      email,
      phone,
      orders: [], // initialize empty order history
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ message: "User registered successfully." });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Unknown error occurred" });
  }
});

/**
 * GET /user/:uid
 * Fetches a user's profile and auth info.
 */
app.get("/user/:uid", async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    const authDoc = await db.collection("authIdentifiers").doc(uid).get();
    const profileDoc = await db.collection("diadem-pepsa").doc(uid).get();

    if (!authDoc.exists || !profileDoc.exists) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      auth: authDoc.data(),
      profile: profileDoc.data(),
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Unknown error occurred" });
  }
});

/**
 * PUT /user/:uid
 * Updates profile data (in diadem-pepsa) only.
 */
app.put("/user/:uid", async (req: Request, res: Response) => {
  const { uid } = req.params;
  const updateData = req.body;

  try {
    await db.collection("diadem-pepsa").doc(uid).update(updateData);
    return res.status(200).json({ message: "User profile updated." });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Unknown error occurred" });
  }
});

/**
 * DELETE /user/:uid
 * Deletes both authIdentifiers and profile.
 */
app.delete("/user/:uid", async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    await db.collection("authIdentifiers").doc(uid).delete();
    await db.collection("diadem-pepsa").doc(uid).delete();
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Unknown error occurred" });
  }
});

/**
 * POST /user/:uid/order
 * Appends a new order to user's order history in diadem-pepsa.
 */
app.post("/user/:uid/order", async (req: Request, res: Response) => {
  const { uid } = req.params;
  const orderData = req.body;

  try {
    const userRef = db.collection("diadem-pepsa").doc(uid);
    await userRef.update({
      orders: admin.firestore.FieldValue.arrayUnion({
        ...orderData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }),
    });

    return res.status(200).json({ message: "Order added to history." });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Unknown error occurred" });
  }
});

exports.api = functions.https.onRequest(app);
