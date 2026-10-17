// Gemini API wrapper
// In production, move the API key to a server-side proxy so it is never
// exposed in the browser bundle.

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash-preview-05-20';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Send a prompt to the Gemini generative-language API and return the
 * text of the first candidate.
 *
 * @param {string} prompt - user / system combined prompt text
 * @param {string} [systemInstruction] - optional system instruction
 * @returns {Promise<string>} generated text
 */
export async function callGemini(prompt, systemInstruction) {
  const apiKey = GEMINI_API_KEY;
  if (!apiKey) {
    return 'Gemini API key is not configured. Set VITE_GEMINI_API_KEY in your .env.local file.';
  }

  const url = `${BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    'Unable to generate a response at this time.'
  );
}
