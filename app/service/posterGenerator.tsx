
import { useEffect, useState } from 'react';

const usePosterGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [height, setHeight] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)

  const generatePrompt = async (participationMessage: string, eventname: string, bannerwidth: number, bannerheight: number) => {
    try {
      setHeight(bannerheight);
      setWidth(bannerwidth);
      setIsLoading(true);
      // Create the prompt directly
      // const promptText = `Generate a POSTER/BANNER for event "${eventname}". Include message on the poster. Message is "Come join us at the event ${participationMessage}". Do not make any Spelling mistakes on the generated poster. Do not include any other gibberish or any texts other then the provided message`;
      const promptText = `Design a high-quality, eye-catching banner for the event '${eventname}'. The banner should feature a clean and modern layout, incorporating a bold and easy-to-read typography. Include the following text: 'Join us at ${eventname} - ${participationMessage}'. Ensure precise spelling and grammar. Exclude any unnecessary text, gibberish, or distracting elements. Incorporate relevant visuals or graphics that convey the event's theme or industry. Use a palette of 2-3 complementary colors to create visual appeal.`
      setPrompt(promptText);
    } catch (error) {
      console.error("Error generating prompt:", error);
    }
  };

  const generatePoster = async () => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API;
    if (prompt) {
      try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model : "dall-e-3",
            prompt: prompt,
            n: 1,
            size: `1792x1024`,
            response_format: "url",
          }),
        });
        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers);
        const responseData = await response.json();
        console.log(responseData);
        const imageUrl = responseData.data[0].url;
        setImageUrl(imageUrl);
      } catch (error) {
        console.error("Error generating poster:", error);
      } finally {
        setIsLoading(false);
        setPrompt(""); // Clear prompt after generating the poster
      }
    }
  };
  useEffect(() => {
    generatePoster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);

  return { prompt, isLoading, imageUrl, generatePrompt, generatePoster };
};

export default usePosterGenerator;
