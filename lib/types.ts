export interface GenerateImageRequest {
   imageDataUrl: string;
   prompt: string;
   style: string;
}

export interface GenerateImageResponse {
   id: string;
   imageUrl: string;
   prompt: string;
   style: string;
   createdAt: string;
}

export interface HistoryItem {
   id: string;
   originalImageUrl: string;
   generatedImageUrl: string;
   prompt: string;
   style: string;
   createdAt: string;
}
