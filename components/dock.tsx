"use client";

import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import imageCompression from "browser-image-compression";
import Image from "next/image";

import {
   PlusIcon,
   XIcon,
   SendIcon,
   StopCircleIcon,
   LoaderIcon,
} from "lucide-react";

import { generateImageWithAbort } from "@/lib/api";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/customSelect";
import { toast } from "sonner";

interface DockProps {
   className?: string;
   onImageGenerated?: (result: {
      id: string;
      imageUrl: string;
      prompt: string;
      style: string;
      createdAt: string;
   }) => void;
   onGenerationStart?: (originalImageUrl: string) => void;
   onAbort?: () => void;
}

interface FormData {
   image: File | null;
   imageDataUrl: string;
   prompt: string;
   style: string;
}

const STYLE_OPTIONS = [
   { value: "editorial", label: "Editorial" },
   { value: "streetwear", label: "Streetwear" },
   { value: "vintage", label: "Vintage" },
];

const MAX_FILE_SIZE_IN_MB = 2; // 2MB
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;

export function Dock({
   className,
   onImageGenerated,
   onGenerationStart,
   onAbort,
}: DockProps) {
   const [formData, setFormData] = useState<FormData>({
      image: null,
      imageDataUrl: "",
      prompt: "",
      style: "",
   });

   const [isProcessing, setIsProcessing] = useState(false);
   const isAbortedRef = useRef(false);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const generateMutation = useMutation({
      mutationFn: async (data: {
         imageDataUrl: string;
         prompt: string;
         style: string;
      }) => {
         // Reset abort flag when starting new request
         isAbortedRef.current = false;
         onGenerationStart?.(formData.imageDataUrl);
         const result = await generateImageWithAbort(data);
         return result;
      },
      onSuccess: (result) => {
         // Only process if not aborted
         console.log("isAbortedRef.current", isAbortedRef.current);
         if (!isAbortedRef.current) {
            console.log("Image generated successfully", result);
            onImageGenerated?.(result);
            setFormData({
               image: null,
               imageDataUrl: "",
               prompt: "",
               style: "",
            });
            if (fileInputRef.current) {
               fileInputRef.current.value = "";
            }
         } else {
            console.log("Response ignored - request was aborted");
         }
      },
      onError: (error) => {
         // Only show error if not aborted
         if (!isAbortedRef.current) {
            console.error("Failed to generate image", error);
            toast.error(`Generation failed: ${error.message}`);
            onAbort?.();
         }
      },
      retry: (failureCount, error) => {
         // Do not retry if aborted
         if (isAbortedRef.current) return false;
         if (error.name === "AbortError" || error.message.includes("aborted")) {
            return false;
         }
         // retry up to 3 times
         return failureCount < 3;
      },
      retryDelay: (attemptIndex) => {
         // exponential backoff 1s, 2s, 4s
         return Math.min(1000 * 2 ** attemptIndex, 30000);
      },
   });
   const isGenerating = generateMutation.isPending;

   const handleImageUpload = async (file: File) => {
      if (!file.type.startsWith("image/")) {
         toast.error("Please upload a valid image file (PNG or JPG)");
         return;
      }

      setIsProcessing(true);

      try {
         let processedFile = file;

         // Check if image needs compression
         const img = document.createElement("img");
         img.src = URL.createObjectURL(file);

         await new Promise((resolve) => {
            img.onload = resolve;
         });

         if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
            const options = {
               maxSizeMB: MAX_FILE_SIZE_IN_MB,
               maxWidthOrHeight: MAX_WIDTH,
               useWebWorker: true,
               fileType: file.type,
            };

            processedFile = await imageCompression(file, options);
         }

         // Convert to data URL
         const reader = new FileReader();
         reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setFormData((prev) => ({
               ...prev,
               image: processedFile,
               imageDataUrl: dataUrl,
            }));
         };
         reader.readAsDataURL(processedFile);
      } catch (error) {
         console.error("Error processing image", error);
         toast.error("Error processing image. Please try again.");
      } finally {
         setIsProcessing(false);
      }
   };

   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         handleImageUpload(file);
      }
   };

   const removeImage = () => {
      setFormData((prev) => ({
         ...prev,
         image: null,
         imageDataUrl: "",
      }));
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.image || !formData.prompt || !formData.style) {
         toast.warning("Please fill in all fields");
         return;
      }

      // Trigger the mutation
      generateMutation.mutate({
         imageDataUrl: formData.imageDataUrl,
         prompt: formData.prompt,
         style: formData.style,
      });
   };

   const handleAbort = () => {
      isAbortedRef.current = true;
      onAbort?.();
      toast.info("Generation cancelled");
   };

   return (
      <div
         className={cn(
            "bg-background/95 backdrop-blur-lg rounded-2xl border shadow-2xl",
            "max-w-2xl w-full",
            className
         )}
      >
         <form onSubmit={handleSubmit} className="p-4">
            <div className="flex items-center gap-3">
               {/* Image Upload Button */}
               <div className="relative">
                  <input
                     ref={fileInputRef}
                     id="image-upload"
                     type="file"
                     accept="image/*"
                     onChange={handleFileSelect}
                     className="hidden"
                     disabled={isProcessing}
                  />
                  <Button
                     type="button"
                     variant="outline"
                     size="icon"
                     className="h-10 w-10 rounded-xl"
                     onClick={() => fileInputRef.current?.click()}
                     disabled={isProcessing || isGenerating}
                  >
                     {isProcessing ? (
                        <LoaderIcon className="h-4 w-4 animate-spin" />
                     ) : (
                        <PlusIcon className="h-4 w-4" />
                     )}
                  </Button>

                  {/* Image Preview Thumbnail */}
                  {formData.imageDataUrl && (
                     <div className="absolute -top-16 left-0 bg-background border rounded-lg p-1 shadow-lg">
                        <div className="relative">
                           <Image
                              src={formData.imageDataUrl}
                              alt="Uploaded preview"
                              width={96}
                              height={48}
                              className="h-12 w-24 object-cover rounded"
                              style={{ objectFit: "cover" }}
                              unoptimized
                           />
                           <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-5 w-5"
                              onClick={removeImage}
                           >
                              <XIcon className="h-3 w-3" />
                           </Button>
                        </div>
                     </div>
                  )}
               </div>

               {/* Style Selector */}
               <div className="w-25">
                  <CustomSelect
                     value={formData.style}
                     onChange={(value) =>
                        setFormData((prev) => ({ ...prev, style: value }))
                     }
                     placeholder="Style..."
                     options={STYLE_OPTIONS}
                  />
               </div>

               {/* Prompt Input */}
               <div className="flex-1">
                  <Input
                     id="prompt"
                     type="text"
                     placeholder="Describe your image..."
                     value={formData.prompt}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           prompt: e.target.value,
                        }))
                     }
                     className="border-0 shadow-none focus-visible:ring-0 bg-transparent"
                  />
               </div>

               {/* Generate Button */}
               <Button
                  type={isGenerating ? "button" : "submit"}
                  size="icon"
                  className="h-10 w-10 rounded-xl"
                  disabled={
                     !formData.image ||
                     !formData.prompt ||
                     !formData.style ||
                     isProcessing
                  }
                  onClick={isGenerating ? handleAbort : undefined}
               >
                  {isGenerating ? (
                     <StopCircleIcon className="h-4 w-4" />
                  ) : (
                     <SendIcon className="h-4 w-4" />
                  )}
               </Button>
            </div>
         </form>
      </div>
   );
}
