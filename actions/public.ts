"use server";

import { unstable_cache } from "next/cache";


export async function getPixabayImage(query: string) {
    try {
        const res = await fetch(`https://pixabay.com/api?q=${query}&key=${process.env.PIXABAY_API_KEY}&min_width=1280&min_height=720&image_type=illustration&category=feelings`)
        const data= await res.json();
        return data.hits[0]?.largeImageURL || null;
    } catch (error) {
        console.error("Error fetching image from Pixabay:", error);
        return null;
    }
}

export const getDailyPrompt = unstable_cache(
    async ()=>{

        try {
            const res = await fetch("https://api.adviceslip.com/advice", {
                cache: "no-store",
            })

            if (!res.ok) {
                throw new Error(`Advice API request failed with status ${res.status}`);
            }
            
            const data = await res.json();
            return data.slip as { id: number; advice: string };
            
        } catch (error: unknown) {
            console.log("Error fetching daily prompt:", error);            
            return null;
        }

    }, ["daily-prompt"],

    {
        revalidate: 86400,
        tags: ["daily-prompt"],
    }
)