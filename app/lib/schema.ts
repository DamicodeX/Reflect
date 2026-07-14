import { z } from "zod";

export const journalSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().refine((value) => {
        const plainText = value
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;/g, " ")
            .trim();

        return plainText.length > 0;
    }, "Content is required"),
    mood: z.string().min(1, "Mood is required"),
    collectionId: z.string().optional(),
})

export const collectionSchema = z.object({
    name:z.string().min(1, "Collection name is required"),
    description: z.string().optional(), 
    // collectionId: z.string().optional(),
})