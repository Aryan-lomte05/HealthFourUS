export async function POST(request) {
  try {
    const { text, sourceLang, targetLang } = await request.json();

    console.log(`🔄 Translation request: "${text}" from ${sourceLang} to ${targetLang}`);

    // If source and target are the same, return as-is
    if (sourceLang === targetLang) {
      return Response.json({ 
        translatedText: text, 
        success: true,
        originalText: text,
        sourceLang,
        targetLang
      });
    }

    // ✅ Use Google Translate free endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract translated text from response
    const translatedText = data[0]
      .map((item) => item[0])
      .filter(Boolean) // Remove null/undefined
      .join("");

    console.log(`✅ Translated: "${translatedText}"`);

    return Response.json({
      translatedText: translatedText,
      originalText: text,
      sourceLang: sourceLang,
      targetLang: targetLang,
      success: true,
    });

  } catch (error) {
    console.error("❌ Translation error:", error);
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
