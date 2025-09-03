import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";

import { SearchForm } from "@/components/ui/search-form";
import { VersionSwitcher } from "@/components/ui/version-switcher";
import { HistoryItem } from "@/lib/types";
import { getHistory, formatTimeAgo } from "@/lib/history";
import { blurDataURL } from "@/lib/constants";
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarRail,
} from "@/components/ui/sidebar";

const data = {
   versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
   history?: HistoryItem[];
   onHistoryItemClick?: (item: HistoryItem) => void;
}

export function AppSidebar({
   history = [],
   onHistoryItemClick,
   ...props
}: AppSidebarProps) {
   const [localHistory, setLocalHistory] = useState<HistoryItem[]>([]);

   // Load history from localStorage on mount and update when prop changes
   useEffect(() => {
      if (history.length > 0) {
         setLocalHistory(history);
      } else {
         setLocalHistory(getHistory());
      }
   }, [history]);
   return (
      <Sidebar {...props}>
         <SidebarHeader>
            <VersionSwitcher
               versions={data.versions}
               defaultVersion={data.versions[0]}
            />
            <SearchForm />
         </SidebarHeader>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Recent Images</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {localHistory.length === 0 ? (
                        <div className="text-sm text-muted-foreground p-4 text-center">
                           No recent images yet
                        </div>
                     ) : (
                        localHistory.map((item) => (
                           <SidebarMenuItem key={item.id}>
                              <SidebarMenuButton
                                 asChild
                                 className="h-auto p-2 cursor-pointer hover:bg-accent/50"
                              >
                                 <button
                                 
                                    className="flex items-start gap-3"
                                    onClick={() => onHistoryItemClick?.(item)}
                                 >
                                    <div className="flex-shrink-0">
                                       <Image
                                          src={item.originalImageUrl}
                                          alt="Original uploaded image"
                                          width={24}
                                          height={24}
                                          className="w-12 h-16 object-cover rounded border"
                                          style={{ objectFit: "cover" }}
                                          unoptimized
                                          placeholder="blur"
                                          blurDataURL={blurDataURL}
                                       />
                                    </div>
                                    <div className="flex-1 min-w-0 my-auto">
                                       <p className="text-sm font-medium text-foreground truncate capitalize">
                                          {item.style}
                                       </p>
                                       <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed capitalize">
                                          {item.prompt.length > 25
                                             ? `${item.prompt.substring(
                                                  0,
                                                  25
                                               )}...`
                                             : item.prompt}
                                       </p>
                                       <p className="text-[10px] text-muted-foreground mt-1">
                                          {formatTimeAgo(item.createdAt)}
                                       </p>
                                    </div>
                                 </button>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        ))
                     )}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
         <SidebarRail />
      </Sidebar>
   );
}
