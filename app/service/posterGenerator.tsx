// import { useState, useEffect } from 'react';
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const usePosterGenerator = () => {
//   const [prompt, setPrompt] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [imageUrl, setImageUrl] = useState<string>("");
//   const [height, setHeight] = useState<number>(0)
//   const [width, setWidth] = useState<number>(0)

//   const generatePrompt = async (location: string, description: string, eventname : string, bannerwidth : number, bannerheight:number) => {
//     try {
//       setHeight(bannerheight)
//       setWidth(bannerwidth)
//       setIsLoading(true);
//       const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API as string);
//       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//       const promptText = `Generate a detailed single paragraph prompt without pointers for stable diffusion to generate a POSTER for the given location, name and description. Location is ${location}. Description is ${description}. Event name is ${eventname}. Also include "Come join us at the event" on poster. Prompt characters should not be more then 300`;
//       const result = await model.generateContent(promptText);
//       const response = await result.response;
//       const text = await response.text();
//       setPrompt(text);
//       console.log(text);
//     } catch (error) {
//       console.error("Error generating prompt:", error);
//     }
//   };

//   const generatePoster = async () => {
//     console.log("height : ", height)
//     console.log("width : ", width)
//     const apiKey = process.env.NEXT_PUBLIC_RUNPOD_API;
//     if (prompt) {
//       const options: RequestInit = {
//         method: 'POST',
//         headers: {
//           accept: 'application/json',
//           'content-type': 'application/json',
//           authorization: apiKey as string
//         },
//         body: JSON.stringify({
//           input: {
//             prompt,
//             num_inference_steps: 25,
//             refiner_inference_steps: 50,
//             width: width,
//             height: height,
//             guidance_scale: 7.5,
//             strength: 0.3,
//             seed: null,
//             num_images: 1
//           }
//         })
//       };
//       try {
//         const response = await fetch('https://api.runpod.ai/v2/sdxl/runsync', options);
//         const responseData = await response.json();
//         console.log(responseData);
//         console.log(responseData.output.image_url)
//         setImageUrl(responseData.output.image_url);
//       } catch (error) {
//         console.error("Error generating poster:", error);
//       }
//       setIsLoading(false);
//       setPrompt(""); // Clear prompt after generating the poster
//     }
//   };

//   useEffect(() => {
//     generatePoster();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [prompt]);

//   return { prompt, isLoading, imageUrl, generatePrompt, generatePoster };
// };

// export default usePosterGenerator;
import { useEffect, useState } from 'react';

const usePosterGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [height, setHeight] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)

  const generatePrompt = async (location: string, description: string, eventname: string, bannerwidth: number, bannerheight: number) => {
    try {
      setHeight(bannerheight);
      setWidth(bannerwidth);
      setIsLoading(true);
      // Create the prompt directly
      const promptText = `Generate a POSTER/BANNER for event "${eventname}" taking place at "${location}". Include message on the poster. Message is "Come join us at the event ${eventname}". Do not make any Spelling mistakes on the generated poster. Do not include any other gibberish or any texts other then the provided message`;
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
