"use client";

import { useState, useEffect } from "react";
import { Dock } from "@/components/dock";
import { ImagePreview } from "@/components/image-preview";
import { HistoryItem } from "@/lib/types";
import { saveToHistory } from "@/lib/history";

interface GeneratorProps {
   selectedHistoryItem?: HistoryItem | null;
   onHistoryUpdate?: (newHistory: HistoryItem[]) => void;
   onClearSelection?: () => void;
}

export default function Generator({
   selectedHistoryItem,
   onHistoryUpdate,
   onClearSelection,
}: GeneratorProps) {
   const [originalImage, setOriginalImage] = useState<string>();
   const [generatedImage, setGeneratedImage] = useState<string>();
   const [isGenerating, setIsGenerating] = useState(false);

   // Handle selected history item from sidebar
   useEffect(() => {
      if (selectedHistoryItem) {
         setOriginalImage(selectedHistoryItem.originalImageUrl);
         setGeneratedImage(selectedHistoryItem.generatedImageUrl);
         setIsGenerating(false);
      }
   }, [selectedHistoryItem]);

   const handleClear = () => {
      setOriginalImage(undefined);
      setGeneratedImage(undefined);
      setIsGenerating(false);
      onClearSelection?.();
   };

   const handleGenerationStart = (originalImageUrl: string) => {
      setOriginalImage(originalImageUrl);
      setIsGenerating(true);
   };

   const handleAbort = () => {
      setIsGenerating(false);
   };

   const handleImageGenerated = (result: {
      id: string;
      imageUrl: string;
      prompt: string;
      style: string;
      createdAt: string;
   }) => {
      setGeneratedImage(result.imageUrl);
      setIsGenerating(false);

      // Save to history if we have both original and generated images
      if (originalImage) {
         const historyItem: HistoryItem = {
            id: result.id,
            originalImageUrl: originalImage,
            generatedImageUrl: result.imageUrl,
            prompt: result.prompt,
            style: result.style,
            createdAt: result.createdAt,
         };

         const updatedHistory = saveToHistory(historyItem);
         onHistoryUpdate?.(updatedHistory);
      }

      console.log("New image generated:", result);
   };

   return (
      <div className="min-h-screen flex flex-col">
         {/* Image Preview Section */}
         <div className="flex-1 container mx-auto p-6">
            <ImagePreview
               originalImageUrl={originalImage}
               generatedImageUrl={generatedImage}
               isLoading={isGenerating}
               onClear={handleClear}
               className="mx-auto max-w-4xl h-full"
            />
         </div>

         {/* Dock Section */}
         <div className="flex-[0.3] container mx-auto p-6 pt-0">
            <div className="max-w-2xl mx-auto">
               <Dock
                  onImageGenerated={handleImageGenerated}
                  onGenerationStart={handleGenerationStart}
                  onAbort={handleAbort}
               />
            </div>
         </div>
      </div>
   );
}
