// Gemini API wrapper
// Supports dynamic reading of import.meta.env, window.__gemini_api_key, or Vite env

function getApiKey() {
  const envKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  if (envKey) return envKey;

  if (typeof window !== 'undefined' && window.__gemini_api_key) {
    return String(window.__gemini_api_key).trim();
  }
  return '';
}

// Default models to try: gemini-2.5-flash -> gemini-2.0-flash -> gemini-1.5-flash
const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-3.8-flash';
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
  const apiKey = getApiKey();
  if (!apiKey) {
    return 'Gemini API key is not configured. Please ensure VITE_GEMINI_API_KEY is set in .env.local and restart your dev server.';
  }

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  // Attempt with primary model, then fallback model if needed
  const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        console.warn(`Gemini call failed with model ${model}:`, errorMsg);
        lastError = errorMsg;
        continue;
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text;
      } else if (data?.candidates?.[0]?.finishReason) {
        return `Response finished with reason: ${data.candidates[0].finishReason}`;
      }
    } catch (err) {
      console.warn(`Network error with model ${model}:`, err);
      lastError = err.message;
    }
  }

  return `Unable to generate AI response. Details: ${lastError || 'Unknown error. Please check your API key and connection.'}`;
}

