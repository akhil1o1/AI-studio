"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { WifiOffIcon, WifiIcon } from "lucide-react";

export function NetworkStatus() {
   const [hasShownOfflineToast, setHasShownOfflineToast] = useState(false);

   useEffect(() => {
      const handleOnline = () => {
         setHasShownOfflineToast(false);

         // Dismiss the offline toast
         toast.dismiss("offline-toast");

         // Show success toast when back online
         toast.success("Connection restored", {
            description: "You're back online",
            icon: <WifiIcon className="h-4 w-4" />,
            duration: 3000,
         });
      };

      const handleOffline = () => {
         setHasShownOfflineToast((prev) => {
            if (!prev) {
               toast.error("No internet connection", {
                  description: "Please check your network connection",
                  icon: <WifiOffIcon className="h-4 w-4" />,
                  duration: Infinity, // Keep it visible until back online
                  id: "offline-toast", // Unique ID to prevent duplicates
               });
               return true;
            }
            return prev;
         });
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
         window.removeEventListener("online", handleOnline);
         window.removeEventListener("offline", handleOffline);
      };
   }, []);

   return null;
}
