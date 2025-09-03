import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { NetworkStatus } from "@/components/ui/networkStatus";

import "./globals.css";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Modelia - AI Studio",
   description: "Best AI fashion model generator",
   manifest: "/manifest.json",
   icons: {
      icon: "/icons/icon-192x192.png",
      apple: "/icons/icon-192x192.png",
   },
};

export const viewport: Viewport = {
   themeColor: "#000000",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            suppressHydrationWarning
         >
            <ThemeProvider
               attribute="class"
               defaultTheme="system"
               enableSystem
               disableTransitionOnChange
            >
               <QueryProvider>{children}</QueryProvider>
            </ThemeProvider>
            <Toaster />
            <NetworkStatus />
         </body>
      </html>
   );
}
