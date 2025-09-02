"use server";

import { revalidatePath } from "next/cache";
import { GenerateImageResponse, GenerateImageRequest } from "@/lib/types";

export async function generateImage(
   data: GenerateImageRequest
): Promise<GenerateImageResponse> {
   // simulate 3 second delay
   await new Promise((resolve) => setTimeout(resolve, 3000));

   // 30% chance of error
   if (Math.random() < 0.3) {
      throw new Error("An error occurred while generating the image.");
   }

   // mock landscape images (wide format, under 1920px)
   const mockImageUrls = [
      "https://picsum.photos/1600/900?random=1",
      "https://picsum.photos/1600/900?random=2",
      "https://picsum.photos/1600/900?random=3",
      "https://picsum.photos/1600/900?random=4",
      "https://picsum.photos/1600/900?random=5",
      "https://picsum.photos/1600/900?random=6",
      "https://picsum.photos/1600/900?random=7",
      "https://picsum.photos/1600/900?random=8",
   ];
    revalidatePath(`/`);

   return {
      id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      imageUrl: mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)],
      prompt: data.prompt,
      style: data.style,
      createdAt: new Date().toISOString(),
   };
}
