import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Production: Use environment variable
    console.log('Using Firebase credentials from environment variable');
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Development: Use local file
    console.log('Using Firebase credentials from local file');
    const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
  }
} catch (err) {
  console.error("Failed to read Firebase service account:", err);
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin initialized successfully');
}

export const getAdmin = () => admin;