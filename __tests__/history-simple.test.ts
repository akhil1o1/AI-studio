import { saveToHistory, getHistory } from "@/lib/history";
import { HistoryItem } from "@/lib/types";

// Mock localStorage
const localStorageMock = {
   getItem: jest.fn(),
   setItem: jest.fn(),
   removeItem: jest.fn(),
   clear: jest.fn(),
};

// Override the global localStorage
Object.defineProperty(window, "localStorage", {
   value: localStorageMock,
});

describe("History Utility Functions - Simple Tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      (localStorage.getItem as jest.Mock).mockClear();
      (localStorage.setItem as jest.Mock).mockClear();
   });

   test("saveToHistory should save item to localStorage", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue("[]");

      const newItem: HistoryItem = {
         id: "test-1",
         originalImageUrl: "https://example.com/original.jpg",
         generatedImageUrl: "https://example.com/generated.jpg",
         prompt: "Test prompt",
         style: "editorial",
         createdAt: "2024-01-01T00:00:00Z",
      };

      const result = saveToHistory(newItem);

      expect(localStorage.getItem).toHaveBeenCalledWith("ai-studio-history");
      expect(localStorage.setItem).toHaveBeenCalledWith(
         "ai-studio-history",
         JSON.stringify([newItem])
      );
      expect(result).toEqual([newItem]);
   });

   test("getHistory should retrieve items from localStorage", () => {
      const mockHistory: HistoryItem[] = [
         {
            id: "item-1",
            originalImageUrl: "https://example.com/1.jpg",
            generatedImageUrl: "https://example.com/1-gen.jpg",
            prompt: "Test prompt 1",
            style: "editorial",
            createdAt: "2024-01-01T00:00:00Z",
         },
      ];

      (localStorage.getItem as jest.Mock).mockReturnValue(
         JSON.stringify(mockHistory)
      );

      const result = getHistory();

      expect(localStorage.getItem).toHaveBeenCalledWith("ai-studio-history");
      expect(result).toEqual(mockHistory);
   });

   test("getHistory should return empty array when no history exists", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      const result = getHistory();

      expect(result).toEqual([]);
   });

   test("getHistory should handle corrupted data gracefully", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue("invalid json");

      const result = getHistory();

      expect(result).toEqual([]);
   });

   test("saveToHistory should limit history to 5 items", () => {
      const existingHistory = Array.from({ length: 5 }, (_, i) => ({
         id: `item-${i}`,
         originalImageUrl: `https://example.com/orig-${i}.jpg`,
         generatedImageUrl: `https://example.com/gen-${i}.jpg`,
         prompt: `Prompt ${i}`,
         style: "editorial",
         createdAt: `2024-01-0${i + 1}T00:00:00Z`,
      }));

      (localStorage.getItem as jest.Mock).mockReturnValue(
         JSON.stringify(existingHistory)
      );

      const newItem: HistoryItem = {
         id: "new-item",
         originalImageUrl: "https://example.com/new.jpg",
         generatedImageUrl: "https://example.com/new-gen.jpg",
         prompt: "New prompt",
         style: "vintage",
         createdAt: "2024-01-06T00:00:00Z",
      };

      const result = saveToHistory(newItem);

      expect(result).toHaveLength(5);
      expect(result[0]).toEqual(newItem);
      expect(result).not.toContain(existingHistory[4]); // Last item should be removed
   });
});
