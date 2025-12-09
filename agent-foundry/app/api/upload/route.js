import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getDb } from "@/lib/db";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const patientId = formData.get("patientId");
    const fileCategory = formData.get("fileCategory") || "xray";

    if (!file || !patientId) {
      return NextResponse.json(
        { error: "Missing file or patientId" },
        { status: 400 }
      );
    }

    // ✅ Only xrays and prescriptions
    const categoryFolder = fileCategory === "prescription" ? "prescriptions" : "xrays";
    
    const uploadDir = path.join(process.cwd(), "uploads", patientId, categoryFolder);
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("✅ Created directory:", uploadDir);
    }

    // Save file locally
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = path.join(uploadDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    console.log("✅ File saved to:", filepath);

    // Store relative path
    const relativePath = `uploads/${patientId}/${categoryFolder}/${filename}`;

    // Send to external backend for analysis
    let backendSummary = null;
    try {
      const backendFormData = new FormData();
      backendFormData.append("file", file);
      backendFormData.append("patientId", patientId);
      backendFormData.append("fileType", file.type);

      console.log("📤 Sending to backend: http://192.168.50.34:8080/api/file/file");

      const backendResponse = await fetch("http://192.168.50.34:8080/api/file/file", {
        method: "POST",
        body: backendFormData,
      });

      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        backendSummary = backendData.summary || backendData;
        console.log("✅ Backend analysis received:", backendSummary);
      } else {
        console.warn("⚠️ Backend returned:", backendResponse.status);
      }
    } catch (error) {
      console.error("⚠️ Backend analysis failed:", error.message);
    }

    // Save to database
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO uploaded_files (
        patient_id, 
        original_name, 
        file_name,
        file_path, 
        file_category, 
        file_type,
        mime_type,
        file_size,
        status, 
        summary
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      patientId,
      file.name,
      filename,
      relativePath,
      fileCategory,
      file.type,
      file.type,
      file.size,
      backendSummary ? "processed" : "pending",
      backendSummary ? JSON.stringify(backendSummary) : null
    );

    console.log("✅ Saved to database with ID:", result.lastInsertRowid);

    return NextResponse.json({
      success: true,
      fileId: result.lastInsertRowid,
      filePath: relativePath,
      summary: backendSummary,
      message: "File uploaded successfully",
    });

  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const fileCategory = searchParams.get("fileCategory");

    if (!patientId) {
      return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
    }

    const db = getDb();
    let query = "SELECT * FROM uploaded_files WHERE patient_id = ?";
    const params = [patientId];

    if (fileCategory) {
      query += " AND file_category = ?";
      params.push(fileCategory);
    }

    query += " ORDER BY created_at DESC";

    const files = db.prepare(query).all(...params);

    // Parse summary JSON
    const filesWithParsedSummary = files.map((file) => ({
      ...file,
      summary: file.summary ? JSON.parse(file.summary) : null,
    }));

    console.log(`📊 Retrieved ${filesWithParsedSummary.length} files for patient ${patientId}`);

    return NextResponse.json({ files: filesWithParsedSummary });

  } catch (error) {
    console.error("❌ GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve files" },
      { status: 500 }
    );
  }
}
