import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No input text provided" });
  }

  const prompt = `
You are a construction management assistant.

Take the following jobsite update and organize it into clean sections:

1. On Track
2. Risks / Behind Schedule
3. Follow-ups
4. Notes

Then write a professional status email a project manager could send to a supervisor.

Keep it clear, concise, and field-appropriate.

Jobsite update:
${text}
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    res.status(200).json({
      result: response.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({
      error: "AI request failed",
      details: error.message
    });
  }
}
