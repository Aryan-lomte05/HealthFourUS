import { NextResponse } from "next/server";
import db from "@/lib/db";
import { generatePatientId } from "@/lib/patientId";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, age, gender, height, weight, blood_group, allergies, medical_conditions } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = db.prepare("SELECT email FROM patients WHERE email = ?").get(email);
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered. Please login instead." },
        { status: 409 }
      );
    }

    // Generate unique patient ID
    const patientId = generatePatientId();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert into database
    const stmt = db.prepare(`
      INSERT INTO patients (patient_id, name, email, password, age, gender, height, weight, blood_group, allergies, medical_conditions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      patientId,
      name,
      email.toLowerCase(),
      hashedPassword,
      age || null,
      gender || null,
      height || null,
      weight || null,
      blood_group || null,
      allergies || null,
      medical_conditions || null
    );

    console.log(`✅ New patient registered: ${patientId} - ${email}`);

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      patient_id: patientId,
      backend_stored: true,
    });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
