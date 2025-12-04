export async function POST(request) {
  try {
    const { text, sourceLang } = await request.json();

    // If already English, return as-is
    if (sourceLang === "en") {
      return Response.json({ translatedText: text, success: true });
    }

    // Use Google Translate (no API key needed for basic usage)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=en&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    const data = await response.json();

    // Extract translated text
    const translatedText = data[0]
      .map((item) => item[0])
      .join("");

    return Response.json({
      translatedText: translatedText,
      originalText: text,
      sourceLang: sourceLang,
      success: true,
    });

  } catch (error) {
    console.error("Translation error:", error);
    return Response.json(
      {
        error: "Translation failed",
        translatedText: text, // Fallback to original
        success: false,
      },
      { status: 500 }
    );
  }
}
