import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const usePosterGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generatePrompt = async (location: string, description: string, eventname : string) => {
    try {
      setIsLoading(true);
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API as string);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const promptText = `Generate a detailed single paragraph prompt without pointers for stable diffusion to generate a NICE ILLUSTRATION PAINTING/ART for the given location, name and description. Location is ${location}. Description is ${description}. Event name is ${eventname}.`;
      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = await response.text();
      setPrompt(text);
      console.log(text);
    } catch (error) {
      console.error("Error generating prompt:", error);
    }
  };

  const generatePoster = async () => {
    const apiKey = process.env.NEXT_PUBLIC_RUNPOD_API;
    if (prompt) {
      const options: RequestInit = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: apiKey as string
        },
        body: JSON.stringify({
          input: {
            prompt,
            num_inference_steps: 25,
            refiner_inference_steps: 50,
            width: 1024,
            height: 1024,
            guidance_scale: 7.5,
            strength: 0.3,
            seed: null,
            num_images: 1
          }
        })
      };
      try {
        const response = await fetch('https://api.runpod.ai/v2/sdxl/runsync', options);
        const responseData = await response.json();
        console.log(responseData);
        console.log(responseData.output.image_url)
        setImageUrl(responseData.output.image_url);
      } catch (error) {
        console.error("Error generating poster:", error);
      }
      setIsLoading(false);
      setPrompt(""); // Clear prompt after generating the poster
    }
  };

  useEffect(() => {
    generatePoster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);

  return { prompt, isLoading, imageUrl, generatePrompt, generatePoster };
};

export default usePosterGenerator;
