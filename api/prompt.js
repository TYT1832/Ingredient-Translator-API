import OpenAI from "openai";

const key = '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'
const client = new OpenAI({key})
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    if (!key) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY env var on server." });
    }

    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing 'prompt' (string) in JSON body." });
    }

    const resp = await client.responses.create({
      model: "gpt-5.2",
      input: prompt,
    });

    return res.status(200).json({ result: resp.output_text });
  } catch (err) {
    console.error("PROMPT_ERROR:", err);
    return res.status(500).json({
      error: "Failed to run prompt",
      details: err?.message || String(err),
    });
  }
}
