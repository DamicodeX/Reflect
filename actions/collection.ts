"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
type CollectionFormValues = {
  name: string;
  description?: string;
};

export async function createCollection(data: CollectionFormValues) {
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
    
    const collection = await db.collection.create({
        data:{
            name:data.name,
        description: data.description ?? "",
            userId: user.id,
        },
    });

    revalidatePath("/dashboard");
    return collection;

  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
}


export async function getCollections() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Arject Rate Limiting
    // const req = await request();

    // const decision = await aj.protect(req, {
    //   userId,
    //   requested: 1,
    // });

    // if (decision.isDenied()) {
    //   if (decision.reason.isRateLimit()) {
    //     const { remaining, reset } = decision.reason;
    //     console.error({
    //       code: "RATE_LIMIT_EXCEEDED",
    //       details: {
    //         remaining,
    //         resetInSeconds: reset,
    //       },
    //     });
    //     throw new Error("Too many requests. Please try again later.");
    //   }

    //   throw new Error("Request Blocked");
    // }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) throw new Error("User not found");
    
    const collections = await db.collection.findMany({
        where:{
            userId: user.id,
        },
        orderBy: { createdAt: "desc"},
    });
    return collections;
  } catch (error: unknown) {
    console.log("Error fetching collections:", error);
    return [];
  }
}
export async function getCollection(collectionId:string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
     const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
  

    if (!user) throw new Error("User not found");
    //  const collection = await db.user.findUnique({
    //   where: {
    //     clerkUserId: userId,
    //     id:collectionId,
    //   },
    // });
  const collection = await db.collection.findFirst({
        where:{
            userId: user.id,
            id:collectionId,
        },
    });
  return collection;

 
}

export async function deleteCollection(collectionId:string) {
  
  try {
        const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
     const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
  

    if (!user) throw new Error("User not found");

  const collection = await db.collection.findFirst({
        where:{
            userId: user.id,
            id:collectionId,
        },
    });

    if(!collection) throw new Error("Collection not found");

    await db.collection.delete({
      where: {
        id: collectionId,
      },
    });

  return true;
  } catch (error:unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };   
  }

}
