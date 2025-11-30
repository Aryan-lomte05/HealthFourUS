export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // TRY backend first (if Aryan's backend is running)
    try {
      const backendResponse = await fetch("http://localhost:8000/api/patient/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        console.log("✅ Backend login successful");
        return Response.json({
          success: true,
          patient_id: data.patient_id,
          name: data.name,
          email: data.email,
          age: data.age,
          gender: data.gender,
          height: data.height,
          weight: data.weight,
          backend_authenticated: true
        });
      }
    } catch (backendError) {
      console.log("⚠️ Backend not available, checking local storage");
    }

    // FALLBACK: Return success so client can check localStorage
    // Client-side will verify credentials from localStorage
    console.log("📦 Using local authentication");
    
    return Response.json({
      success: true,
      email: email,
      backend_authenticated: false,
      message: "Check local storage for credentials"
    });

  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
