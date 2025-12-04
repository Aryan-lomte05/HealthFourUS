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

    // TODO: Fetch from backend when available
    // For now, return empty array
    return Response.json({ consultations: [] });

  } catch (error) {
    console.error("Chat history error:", error);
    return Response.json(
      { error: error.message || "Failed to load chat history" },
      { status: 500 }
    );
  }
}
