"use client";

import { generateImage } from "@/lib/actions";
import { GenerateImageResponse, GenerateImageRequest } from "@/lib/types";

export async function generateImageWithAbort(
   data: GenerateImageRequest
): Promise<GenerateImageResponse> {
   return generateImage(data);
}
