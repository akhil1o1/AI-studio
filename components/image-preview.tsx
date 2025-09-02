"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, SparklesIcon, XIcon } from "lucide-react";

import { blurDataURL } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
   originalImageUrl?: string;
   generatedImageUrl?: string;
   isLoading?: boolean;
   className?: string;
   onClear?: () => void;
}

export function ImagePreview({
   originalImageUrl,
   generatedImageUrl,
   isLoading,
   className,
   onClear,
}: ImagePreviewProps) {
   const [sliderPosition, setSliderPosition] = useState(50);
   const [isDragging, setIsDragging] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

   const handleMouseDown = () => {
      setIsDragging(true);
      // Prevent text selection during drag
      document.body.style.userSelect = "none";
   };

   useEffect(() => {
      const handleMouseMoveEffect = (e: MouseEvent) => {
         if (!isDragging || !containerRef.current) return;

         const rect = containerRef.current.getBoundingClientRect();
         const x = e.clientX - rect.left;
         const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
         setSliderPosition(percentage);
      };

      const handleMouseUpEffect = () => {
         setIsDragging(false);
         // Re-enable text selection after drag
         document.body.style.userSelect = "";
         document.body.style.webkitUserSelect = "";
      };

      if (isDragging) {
         document.addEventListener("mousemove", handleMouseMoveEffect);
         document.addEventListener("mouseup", handleMouseUpEffect);
         return () => {
            document.removeEventListener("mousemove", handleMouseMoveEffect);
            document.removeEventListener("mouseup", handleMouseUpEffect);
         };
      }
   }, [isDragging]);

   if (isLoading) {
      return (
         <div
            className={`relative w-full h-[60vh] bg-muted/20 rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center ${className}`}
         >
            <div className="text-center text-muted-foreground">
               <div className="bg-primary/10 rounded-full p-6 mx-auto mb-4 w-20 h-20 flex items-center justify-center animate-pulse">
                  <SparklesIcon className="w-10 h-10 text-primary animate-spin" />
               </div>
               <p className="text-lg font-medium">Generating your model...</p>
               <p className="text-sm">This may take a few moments</p>
            </div>
         </div>
      );
   }

   // Show comparison view when both images are available
   if (originalImageUrl && generatedImageUrl) {
      return (
         <div
            ref={containerRef}
            className={`relative w-full h-[60vh] bg-background rounded-xl border overflow-hidden cursor-col-resize select-none ${className}`}
            style={{
               userSelect: "none",
               WebkitUserSelect: "none",
               MozUserSelect: "none",
               msUserSelect: "none",
            }}
         >
            {/* Original Image */}
            <div className="absolute inset-0 select-none pointer-events-none">
               <Image
                  src={originalImageUrl}
                  alt="Original image"
                  fill
                  className="object-contain select-none"
                  unoptimized
                  draggable={false}
                  placeholder="blur"
                  objectFit="cover"
                  blurDataURL={blurDataURL}
               />
               <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium">
                  Original
               </div>
            </div>

            {/* Generated Image with clip path */}
            <div
               className="absolute inset-0 select-none pointer-events-none"
               style={{
                  clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)`,
               }}
            >
               <Image
                  src={generatedImageUrl}
                  alt="Generated model"
                  fill
                  className="object-contain select-none"
                  unoptimized
                  draggable={false}
                  placeholder="blur"
                  objectFit="cover"
                  blurDataURL={blurDataURL}
               />
               <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium">
                  Generated
               </div>
            </div>

            {/* Slider Line */}
            <div
               className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 cursor-col-resize"
               style={{ left: `${sliderPosition}%` }}
               onMouseDown={handleMouseDown}
            >
               {/* Slider Handle */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-300">
                  <div className="flex space-x-0.5">
                     <div className="w-0.5 h-4 bg-gray-400"></div>
                     <div className="w-0.5 h-4 bg-gray-400"></div>
                  </div>
               </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 right-4">
               <Button variant="default" size="icon" onClick={onClear}>
                  <XIcon className="h-4 w-4" />
               </Button>
            </div>
         </div>
      );
   }

   // Show single generated image
   if (generatedImageUrl) {
      return (
         <div
            className={`relative w-full h-[60vh] bg-background rounded-xl border overflow-hidden ${className}`}
         >
            <Image
               src={generatedImageUrl}
               alt="Generated model"
               fill
               className="object-contain"
               unoptimized
               placeholder="blur"
               blurDataURL={blurDataURL}
            />
         </div>
      );
   }

   return (
      <div
         className={`relative w-full h-[60vh] bg-muted/10 rounded-xl border-2 border-dashed border-border/30 flex items-center justify-center ${className} select-none`}
      >
         <div className="text-center text-muted-foreground space-y-4">
            <div className="bg-muted/50 rounded-full p-8 mx-auto w-24 h-24 flex items-center justify-center">
               <ImageIcon className="w-12 h-12" />
            </div>
            <div className="space-y-2">
               <h3 className="text-xl font-semibold text-foreground">
                  Start generating models
               </h3>
               <p className="text-sm max-w-sm mx-auto">
                  Upload an image and describe the style you want to create
                  stunning AI-generated fashion models
               </p>
            </div>
         </div>
      </div>
   );
}
