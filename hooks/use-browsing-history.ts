import { create } from "zustand";
import { persist } from "zustand/middleware";

import { HISTORY_LIMIT } from "@/constants";

type ProductItem = {
  id: string;
  category: string;
};

type BrowsingHistoryStore = {
  products: ProductItem[];
  addItem: (item: ProductItem) => void;
  clear: () => void;
};

export const browsingHistoryStore = create<BrowsingHistoryStore>()(
  persist(
    (set, get) => ({
      products: [],
      addItem: (item: ProductItem) => {
        const current = get().products || [];

        const filtered = current.filter((p) => p.id !== item.id);

        const updated = [item, ...filtered].slice(0, HISTORY_LIMIT);

        set({ products: updated });
      },
      clear: () => set({ products: [] }),
    }),
    {
      name: "browsingHistoryStore",
    }
  )
);

export const useBrowsingHistory = () => {
  const { products, addItem, clear } = browsingHistoryStore();

  return {
    products: products ?? [],
    addItem,
    clear,
  };
};
