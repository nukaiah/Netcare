import admin from "firebase-admin";
import dotenv from 'dotenv'
dotenv.config();
import fs from "fs";



const serviceAccount = {
  type: "service_account",
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key.replace(/\\n/g, "\n"),
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  client_cert_url: process.env.client_cert_url,
};


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
