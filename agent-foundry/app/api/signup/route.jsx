export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['patient_id', 'name', 'email', 'password', 'age', 'gender', 'height', 'weight'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // TRY backend first (if Aryan's backend is running)
    // If it fails, store locally as fallback
    try {
      const backendResponse = await fetch("http://localhost:8000/api/patient/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: body.patient_id,
          name: body.name,
          age: body.age,
          gender: body.gender,
          phone: body.phone || "+91 0000000000",
          location: {
            lat: 0,
            lng: 0,
            address: "India"
          },
          email: body.email,
          password: body.password,
          height: body.height,
          weight: body.weight
        }),
      });

      if (backendResponse.ok) {
        console.log("✅ Backend signup successful");
        return Response.json({
          success: true,
          message: "Account created successfully",
          patient_id: body.patient_id,
          backend_stored: true
        });
      }
    } catch (backendError) {
      console.log("⚠️ Backend not available, using local storage");
    }

    // FALLBACK: Store locally if backend isn't running
    // This allows development without backend
    console.log("📦 Storing user data locally (temp solution)");
    
    return Response.json({
      success: true,
      message: "Account created successfully (stored locally)",
      patient_id: body.patient_id,
      user_data: {
        name: body.name,
        email: body.email,
        age: body.age,
        gender: body.gender,
        height: body.height,
        weight: body.weight,
        password: body.password, // Client will handle storage
      },
      backend_stored: false
    });

  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { error: error.message || "Signup failed" },
      { status: 500 }
    );
  }
}
