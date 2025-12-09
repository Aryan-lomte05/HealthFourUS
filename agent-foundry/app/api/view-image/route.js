import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const imagePath = searchParams.get("path");

    if (!imagePath) {
      return NextResponse.json({ error: "No image path provided" }, { status: 400 });
    }

    // ✅ Clean up path: remove leading slash and convert backslashes
    const cleanPath = imagePath.replace(/^\/+/, '').replace(/\\/g, '/');
    
    // ✅ Build full path from project root
    const fullPath = path.join(process.cwd(), 'public', cleanPath);

    console.log("🔍 Original path from DB:", imagePath);
    console.log("🧹 Cleaned path:", cleanPath);
    console.log("📂 Full path:", fullPath);
    console.log("✅ File exists:", fs.existsSync(fullPath));

    if (!fs.existsSync(fullPath)) {
      // Debug: List actual files in directory
      const dir = path.dirname(fullPath);
      console.log("📁 Checking directory:", dir);
      
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        console.log("📋 Files found:", files);
      } else {
        console.log("❌ Directory doesn't exist");
      }

      return NextResponse.json(
        {
          error: "Image not found",
          requestedPath: imagePath,
          cleanedPath: cleanPath,
          fullPath: fullPath,
          directoryExists: fs.existsSync(dir),
        },
        { status: 404 }
      );
    }

    // ✅ Read and serve the image
    const imageBuffer = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentTypes[ext] || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error("❌ Error serving image:", error);
    return NextResponse.json(
      { error: "Failed to serve image", details: error.message },
      { status: 500 }
    );
  }
}
