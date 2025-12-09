import { getDb } from "./db";
import crypto from "crypto";

export function generatePatientId() {
  const db = getDb();
  let patientId;
  let isUnique = false;
  
  while (!isUnique) {
    patientId = Math.floor(10000 + Math.random() * 90000).toString();
    const existing = db.prepare("SELECT patient_id FROM patients WHERE patient_id = ?").get(patientId);
    if (!existing) {
      isUnique = true;
    }
  }
  
  return patientId;
}

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function createSession(patientId) {
  const db = getDb();
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  
  db.prepare(`
    INSERT INTO sessions (patient_id, session_token, expires_at)
    VALUES (?, ?, ?)
  `).run(patientId, sessionToken, expiresAt);
  
  return sessionToken;
}

export function validateSession(sessionToken) {
  const db = getDb();
  const session = db.prepare(`
    SELECT * FROM sessions 
    WHERE session_token = ? 
    AND datetime(expires_at) > datetime('now')
  `).get(sessionToken);
  
  return session || null;
}

export function deleteSession(sessionToken) {
  const db = getDb();
  db.prepare(`DELETE FROM sessions WHERE session_token = ?`).run(sessionToken);
}
