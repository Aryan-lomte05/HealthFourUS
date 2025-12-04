import { readdir, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patient_id");

    if (!patientId) {
      return Response.json(
        { error: "Missing patient_id" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", patientId);

    if (!existsSync(uploadDir)) {
      return Response.json({ files: [] });
    }

    // Read all subdirectories
    const folders = ["xrays", "prescriptions", "lab-reports"];
    const allFiles = [];

    for (const folder of folders) {
      const folderPath = path.join(uploadDir, folder);
      if (existsSync(folderPath)) {
        const files = await readdir(folderPath);
        
        for (const file of files) {
          const filePath = path.join(folderPath, file);
          const stats = await stat(filePath);
          
          allFiles.push({
            name: file,
            type: folder,
            path: `/uploads/${patientId}/${folder}/${file}`,
            date: stats.mtime.toISOString().split("T")[0], // Use file modification date
            timestamp: stats.mtime.getTime(),
          });
        }
      }
    }

    // Sort by timestamp (newest first)
    allFiles.sort((a, b) => b.timestamp - a.timestamp);

    return Response.json({ files: allFiles });

  } catch (error) {
    console.error("List files error:", error);
    return Response.json(
      { error: error.message || "Failed to list files" },
      { status: 500 }
    );
  }
}
