import Image from "next/image";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import Generator from "@/components/generator";
import { Separator } from "@/components/ui/separator";
import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Page() {
   return (
      <SidebarProvider>
         <AppSidebar />
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
            <Generator />
         </SidebarInset>
      </SidebarProvider>
   );
}
