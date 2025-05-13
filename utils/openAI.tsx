const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_GTM;
const PERPLEXITY_API_KEY = process.env.VITE_PERPLEXITY_API_KEY;
export const suggestionGenerator = async (prompt: string) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "o4-mini",
      messages: [{role: "user", content: prompt}],
    }),
  });

  const data = await response.json();
  return data;
};


