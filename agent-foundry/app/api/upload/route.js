import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const patientId = formData.get("patient_id");
    const fileType = formData.get("file_type");

    if (!file || !patientId || !fileType) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Define folder structure
    const folderMap = {
      xray: "xrays",
      prescription: "prescriptions",
      lab_report: "lab-reports",
    };

    const folder = folderMap[fileType] || "others";

    // Create upload path: public/uploads/{patient_id}/{folder}/
    const uploadDir = path.join(process.cwd(), "public", "uploads", patientId, folder);

    // Create directories if they don't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
      console.log(`✅ Created directory: ${uploadDir}`);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${fileType}_${timestamp}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    console.log(`✅ File saved: ${filePath}`);

    // Return file info
    const publicPath = `/uploads/${patientId}/${folder}/${fileName}`;

    // At the end of POST function, update return:
    return Response.json({
    success: true,
    message: "File uploaded successfully",
    file_path: publicPath,
    file_name: fileName,
    file_type: fileType,
    patient_id: patientId,
    uploaded_at: new Date().toISOString(), // ADD THIS
    });


  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
