import { cert, initializeApp, getApps } from "firebase-admin/app";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

let credential = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT === "string"
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : process.env.FIREBASE_SERVICE_ACCOUNT;
    credential = cert(serviceAccount);
  } catch (err) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:", err.message);
  }
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  credential = cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });
} else {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const serviceAccountPath = path.resolve(__dirname, "../serviceAccountKey.json");
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const fileData = fs.readFileSync(serviceAccountPath, "utf-8");
      credential = cert(JSON.parse(fileData));
    } catch (err) {
      console.error("Failed to read serviceAccountKey.json:", err.message);
    }
  } else {
    console.warn("⚠️ Firebase service account not found! Provide serviceAccountKey.json or set FIREBASE_SERVICE_ACCOUNT in your environment.");
  }
}

export const app = getApps().length === 0 ? initializeApp({ credential }) : getApps()[0];