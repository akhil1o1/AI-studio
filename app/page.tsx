"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Generator from "@/components/generator";
import { Separator } from "@/components/ui/separator";
import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger,
} from "@/components/ui/sidebar";
import { HistoryItem } from "@/lib/types";
import { getHistory } from "@/lib/history";

export default function Page() {
   const [history, setHistory] = useState<HistoryItem[]>([]);
   const [selectedHistoryItem, setSelectedHistoryItem] =
      useState<HistoryItem | null>(null);

   useEffect(() => {
      setHistory(getHistory());
   }, []);

   const handleHistoryUpdate = (newHistory: HistoryItem[]) => {
      setHistory(newHistory);
   };

   const handleHistoryItemClick = (item: HistoryItem) => {
      setSelectedHistoryItem(item);
   };

   const handleClearSelection = () => {
      setSelectedHistoryItem(null);
   };
   return (
      <SidebarProvider>
         <AppSidebar
            history={history}
            onHistoryItemClick={handleHistoryItemClick}
         />
         <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
               <SidebarTrigger className="-ml-1" />
               <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
               />
               <div className="w-full flex items-center justify-between">
                  <Image src={"/logo.svg"} alt="Logo" height={50} width={130} />
                  <ModeToggle />
               </div>
            </header>
            <Generator
               selectedHistoryItem={selectedHistoryItem}
               onHistoryUpdate={handleHistoryUpdate}
               onClearSelection={handleClearSelection}
            />
         </SidebarInset>
      </SidebarProvider>
   );
}
