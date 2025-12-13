import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false, // we will read raw bytes ourselves
  },
};

const client = new OpenAI({ apiKey: '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'});

// Read the request body as a Buffer (works on Vercel Node runtime)
async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST" });
    return;
  }

  try {
    // Expect: raw image bytes in request body
    // And a Content-Type like image/jpeg, image/png...
    const mime = req.headers["content-type"] || "image/jpeg";
    const buf = await readBody(req);

    if (!buf?.length) {
      res.status(400).json({ error: "Empty body. Send image bytes in POST body." });
      return;
    }

    // Convert to base64 data URL for vision
    const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;

    const resp = await client.responses.create({
      model: "gpt-5.2",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Describe what's in this image. List main objects and any visible text." },
            { type: "input_image", image_url: dataUrl },
          ],
        },
      ],
    });

    res.status(200).json({ result: resp.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze image" });
  }
}
