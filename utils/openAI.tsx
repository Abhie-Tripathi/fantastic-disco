const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_GTM;

export const suggestionGenerator = async (prompt: string) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{role: "user", content: prompt}],
    }),
  });

  const data = await response.json();
  return data;
};
