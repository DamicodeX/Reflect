"use server";

import type { z } from "zod";
import { getMoodById, MOODS } from "@/app/lib/mood";
import { db } from "@/lib/prisma";
// import { SortOrder } from "@prisma/client";
import { SortOrder } from "@/lib/generated/prisma/internal/prismaNamespace";
import { auth } from "@clerk/nextjs/server";
import { getPixabayImage } from "./public";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";
import aj from "@/lib/arcjet";
import { journalSchema } from "@/app/lib/schema";

type JournalFormValues = z.infer<typeof journalSchema> & {
  moodQuery: string;
};

type UpdateJournalEntryValues = JournalFormValues & {
  id: string;
};

export async function createJournalEntry(data: JournalFormValues) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Arject Rate Limiting
    const req = await request();

    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });
        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request Blocked");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) throw new Error("User not found");

    const mood = MOODS[data.mood.toUpperCase() as keyof typeof MOODS];
    if (!mood) throw new Error("Invalid mood");

    const moodImageUrl = await getPixabayImage(data.moodQuery);

    const entry = await db.entry.create({
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl,
        userId: user.id,
        collectionId: data.collectionId || null,
      },
    });

    await db.draft.deleteMany({
      where: { userId: user.id },
    });
    revalidatePath("/dashboard");
    return entry;
  } catch (error) {
    console.log("Error creating journal entry:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}

export async function getJournalEntries({
  collectionId,
  orderBy = "desc",
}: { collectionId?: string | null; orderBy?: SortOrder } = {}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) throw new Error("User not found");
    const entries = await db.entry.findMany({
      where: {
        userId: user.id,
        ...(collectionId === "unorganized"
          ? { collectionId: null }
          : collectionId
            ? { collectionId }
            : {}),
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: orderBy,
      },
    });
    const entriesWithMoodData = entries.map((entry) => ({
      ...entry,
      moodData: getMoodById(entry.mood),
    }));
    return {
      success: true,
      data: {
        entries: entriesWithMoodData,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getJournalEntry(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) throw new Error("User not found");
    const entry = await db.entry.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!entry) throw new Error("Entry not found");
    return entry;
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteJournalEntry(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) throw new Error("User not found");

    const entry = await db.entry.findFirst({
      where: {
        userId: user.id,
        id,
      },
    });

    if (!entry) throw new Error("Collection not found");

    await db.entry.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    return entry;

    return true;
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateJournalEntry(data: UpdateJournalEntryValues) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) throw new Error("User not found");

    const existingEntry = await db.entry.findFirst({
      where: {
        userId: user.id,
        id: data.id,
      },
    });

    if (!existingEntry) throw new Error("Entry not found");

    const mood = MOODS[data.mood.toUpperCase() as keyof typeof MOODS];
    if (!mood) throw new Error("Invalid mood");


    let moodImageUrl = existingEntry.moodImageUrl;

    if (existingEntry.mood !== mood.id)
     moodImageUrl = await getPixabayImage(data.moodQuery);

    const updatedEntry = await db.entry.update({
      where: { id: data.id},
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl,
        // userId: user.id,
        collectionId: data.collectionId || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/journal/${data.id}`);
    return updatedEntry;

  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
 
export async function getDraft() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const draft = await db.draft.findUnique({
      where: { userId: user.id },
    });

    return { success: true, data: draft };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function saveDraft(data: { title: string; content: string; mood: string }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const draft = await db.draft.upsert({
      where: { userId: user.id },
      create: {
        title: data.title,
        content: data.content,
        mood: data.mood,
        userId: user.id,
      },
      update: {
        title: data.title,
        content: data.content,
        mood: data.mood,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: draft };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
