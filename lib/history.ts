import { HistoryItem } from "./types";

const HISTORY_KEY = "ai-studio-history";
const MAX_HISTORY_ITEMS = 5;

export function getHistory(): HistoryItem[] {
   if (typeof window === "undefined") return [];

   try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
   } catch (error) {
      console.error("Error reading history from localStorage:", error);
      return [];
   }
}

export function saveToHistory(item: HistoryItem): HistoryItem[] {
   if (typeof window === "undefined") return [];

   try {
      const currentHistory = getHistory();

      // Add new item at the beginning
      const newHistory = [item, ...currentHistory];

      // Keep only the last MAX_HISTORY_ITEMS
      const trimmedHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);

      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));

      return trimmedHistory;
   } catch (error) {
      console.error("Error saving to history:", error);
      return getHistory();
   }
}

export function clearHistory(): void {
   if (typeof window === "undefined") return;

   try {
      localStorage.removeItem(HISTORY_KEY);
   } catch (error) {
      console.error("Error clearing history:", error);
   }
}

export function formatTimeAgo(dateString: string): string {
   const date = new Date(dateString);
   const now = new Date();
   const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
   );

   if (diffInMinutes < 1) return "Just now";
   if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

   const diffInHours = Math.floor(diffInMinutes / 60);
   if (diffInHours < 24) return `${diffInHours}h ago`;

   const diffInDays = Math.floor(diffInHours / 24);
   if (diffInDays < 7) return `${diffInDays}d ago`;

   return date.toLocaleDateString();
}
