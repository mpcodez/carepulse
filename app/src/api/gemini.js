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

/**
 * Extracts structured health metrics from raw conversational voice transcripts
 * using Gemini's natural language understanding.
 *
 * @param {string} transcript - Speech text recorded from the user
 * @param {object} existingForm - The current form values to merge into
 * @returns {Promise<object>} Extracted metrics object matching logForm schema
 */
export async function extractMetricsFromVoice(transcript, existingForm = {}) {
  const prompt = `You are a clinical data extraction assistant specializing in chronic illness patient logs.
A patient who is experiencing fatigue, pain, or low energy recorded this voice note:
"${transcript}"

Extract the health data and return ONLY a valid JSON object (no markdown, no backticks, no extra text) with the following numeric and string keys:
{
  "painLevel": number from 0 to 10 (infer based on language: e.g. "moderate" = 4-5, "agony/severe" = 8-9, "mild" = 2-3),
  "fatigueLevel": number from 0 to 10 (e.g. "exhausted/can barely move" = 8-9, "decent energy" = 2-3),
  "mood": number from 1 to 5 (1 = very low/depressed, 3 = neutral, 5 = great),
  "stress": number from 1 to 5 (1 = calm, 5 = extreme stress),
  "systolic": number or null (e.g. blood pressure systolic if mentioned),
  "diastolic": number or null (e.g. blood pressure diastolic if mentioned),
  "heartRate": number or null (bpm if mentioned),
  "glucose": number or null (blood sugar mg/dL if mentioned),
  "sleepHours": number or null (hours of sleep mentioned),
  "waterIntake": number or null (mL of water mentioned),
  "medsTaken": boolean or null (true if took meds, false if forgot/missed),
  "notes": string summarizing symptoms, flare locations, triggers, and activities mentioned,
  "confidenceSummary": string (one sentence summarizing what was detected to show the patient)
}

If any metric is not mentioned or cannot be inferred, omit it or set it to null.`;

  const systemInstruction = 'You are a precise clinical AI extractor. Output ONLY raw parseable JSON.';
  const rawResponse = await callGemini(prompt, systemInstruction);

  try {
    // Strip possible markdown fences like ```json ... ```
    const cleaned = rawResponse
      .replace(/```json/gi, '')
      .replace(/```/gi, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // Merge non-null extracted fields over existingForm
    const result = { ...existingForm };
    for (const [key, val] of Object.entries(parsed)) {
      if (val !== null && val !== undefined) {
        result[key] = val;
      }
    }
    result.extractedSummary = parsed.confidenceSummary || 'Extracted metrics from voice note.';
    return result;
  } catch (err) {
    console.error('Failed to parse Gemini JSON extraction:', err, rawResponse);
    throw new Error('Could not parse voice data into health metrics. Please verify your transcript and try again.');
  }
}


