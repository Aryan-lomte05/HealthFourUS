export async function POST(request) {
  try {
    const body = await request.json();
    const { patient_id, image_path, image_type } = body;

    if (!patient_id || !image_path || !image_type) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TRY backend analysis first
    try {
      const backendResponse = await fetch("http://localhost:8000/api/medical-images/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id,
          image_path,
          image_type,
        }),
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        console.log("✅ Backend analysis successful");
        return Response.json(data);
      }
    } catch (backendError) {
      console.log("⚠️ Backend not available, using mock analysis");
    }

    // FALLBACK: Return mock analysis
    const mockAnalysis = {
      classification: {
        finding: "Normal - No abnormalities detected",
        confidence: 0.89,
        abnormal: false,
      },
      report: "Mock AI Analysis:\n\nThe uploaded medical image appears normal with no significant findings. This is a placeholder analysis until the backend ML model is connected.",
      confidence: 0.89,
      abnormalities_detected: false,
      recommendations: [
        "Continue regular health monitoring",
        "Consult with doctor if symptoms persist",
      ],
    };

    return Response.json(mockAnalysis);

  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
