export async function POST(request) {
  const { text, language } = await request.json();
  
  // TODO: Replace with real ElevenLabs API
  // For now, return empty audio or use browser's Web Speech API fallback
  
  return new Response(null, {
    status: 501,
    statusText: "TTS not implemented yet. Connect ElevenLabs API.",
  });
}
