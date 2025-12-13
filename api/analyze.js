export default async function handler(req, res) {
  const key = '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'
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No ingredients provided" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an ingredient translator for food labels. Explain each ingredient in simple, neutral language. Flag common allergens. Avoid medical advice."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    res.status(200).json({ result: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: "AI request failed" });
  }
}
