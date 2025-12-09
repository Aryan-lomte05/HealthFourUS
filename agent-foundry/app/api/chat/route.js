export async function POST(request) {
  try {
    const { message, language } = await request.json();
    
    console.log(`📨 Received: "${message}"`);
    
    // Your backend logic here
    const response = "Error while loading message. plz try again later.";
    
    return Response.json({
      response: response,
      success: true,
      emergency: false
    });
    
  } catch (error) {
    return Response.json(
      { response: "Error occurred", success: false },
      { status: 500 }
    );
  }
}