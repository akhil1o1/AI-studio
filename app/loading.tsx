"use client";

import { LoaderIcon } from "lucide-react";

export default function Loading() {
   return (
      <div className="fixed inset-0 w-full h-full bg-background flex items-center justify-center z-50">
         <div className="flex flex-col items-center gap-4">
            <LoaderIcon className="w-12 h-12 animate-spin text-primary" role="status" />
            <p className="text-lg font-medium text-muted-foreground">
               Loading...
            </p>
         </div>
      </div>
   );
}
