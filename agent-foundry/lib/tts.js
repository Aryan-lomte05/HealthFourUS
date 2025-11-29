export async function speakText(text, language = "en") {
  try {
    const response = await fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language }),
    });

    if (!response.ok) {
      throw new Error("TTS API error");
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    await audio.play();
    
    return true;
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return false;
  }
}

export function stopSpeaking() {
  // Stop all audio elements
  document.querySelectorAll("audio").forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}
