import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  wishlistProductIds: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
};

export const wishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistProductIds: [],
      addToWishlist: (productId: string) => {
        const currentIds = get().wishlistProductIds;

        if (!currentIds.includes(productId)) {
          set({ wishlistProductIds: [...currentIds, productId] });
        }
      },
      removeFromWishlist: (productId: string) => {
        const currentIds = get().wishlistProductIds;
        set({
          wishlistProductIds: currentIds.filter((id) => id !== productId),
        });
      },
    }),
    {
      name: "wishlistProductIds",
      version: 1,
    }
  )
);

export const useWishlistService = () => {
  const wishlistProductIds = wishlistStore((state) => state.wishlistProductIds);

  return {
    wishlistProductIds,
    addToWishlist: (productId: string) =>
      wishlistStore.getState().addToWishlist(productId),
    removeFromWishlist: (productId: string) =>
      wishlistStore.getState().removeFromWishlist(productId),
  };
};
