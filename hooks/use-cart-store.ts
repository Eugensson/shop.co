import { create } from "zustand";
import { persist } from "zustand/middleware";

import { PaymentMethod, DeliveryMethod } from "@/constants";
import type { Cart, CartItem, DeliveryAddress } from "@/types";
import { calculateTotalPrice } from "@/lib/calculate-total-price";

interface CartState extends Cart {
  addToCart: (item: CartItem) => void;
  increase: (item: CartItem) => void;
  decrease: (item: {
    productId: string;
    colorId: string;
    sizeId: string;
  }) => void;
  removeItem: (item: {
    productId: string;
    colorId: string;
    sizeId: string;
  }) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setDeliveryAddress: (address: DeliveryAddress) => void;
  clear: () => void;
  init: () => void;
}

const initialState: Cart = {
  items: [],
  totalPrice: 0,
  paymentMethod: PaymentMethod.CASH,
  deliveryMethod: DeliveryMethod.PICKUP_FROM_SHOWROOM,
  deliveryAddress: {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    email: "",
    phone: "",
  },
};

export const cartStore = create<CartState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addToCart: (item: CartItem) => {
        const items = get().items;

        const exist = items.find(
          (x) =>
            x.productId === item.productId &&
            x.sizeId === item.sizeId &&
            x.colorId === item.colorId
        );

        const updatedItems = exist
          ? items.map((x) =>
              x.productId === item.productId &&
              x.sizeId === item.sizeId &&
              x.colorId === item.colorId
                ? { ...x, quantity: x.quantity + item.quantity }
                : x
            )
          : [...items, item];

        const totalPrice = calculateTotalPrice({
          items: updatedItems.map((x) => ({
            price: x.discountedPrice ?? x.price,
            quantity: x.quantity,
          })),
        });

        set({ items: updatedItems, totalPrice });
      },

      increase: (item) => {
        const items = get().items;

        const exist = items.find(
          (x) =>
            x.productId === item.productId &&
            x.colorId === item.colorId &&
            x.sizeId === item.sizeId
        );

        const updatedItems = exist
          ? items.map((x) =>
              x.productId === item.productId &&
              x.colorId === item.colorId &&
              x.sizeId === item.sizeId
                ? { ...x, quantity: x.quantity + 1 }
                : x
            )
          : [...items, { ...item, quantity: 1 }];

        const totalPrice = calculateTotalPrice({
          items: updatedItems.map((x) => ({
            price: x.discountedPrice ?? x.price,
            quantity: x.quantity,
          })),
        });

        set({ items: updatedItems, totalPrice });
      },

      decrease: ({ productId, colorId, sizeId }) => {
        const items = get().items;

        const exist = items.find(
          (x) =>
            x.productId === productId &&
            x.colorId === colorId &&
            x.sizeId === sizeId
        );
        if (!exist) return;

        const updatedItems =
          exist.quantity === 1
            ? items.filter(
                (x) =>
                  !(
                    x.productId === productId &&
                    x.colorId === colorId &&
                    x.sizeId === sizeId
                  )
              )
            : items.map((x) =>
                x.productId === productId &&
                x.colorId === colorId &&
                x.sizeId === sizeId
                  ? { ...x, quantity: x.quantity - 1 }
                  : x
              );

        const totalPrice = calculateTotalPrice({
          items: updatedItems.map((x) => ({
            price: x.discountedPrice ?? x.price,
            quantity: x.quantity,
          })),
        });

        set({ items: updatedItems, totalPrice });
      },

      removeItem: ({ productId, colorId, sizeId }) => {
        const items = get().items;
        const updatedItems = items.filter(
          (x) =>
            !(
              x.productId === productId &&
              x.colorId === colorId &&
              x.sizeId === sizeId
            )
        );

        const totalPrice = calculateTotalPrice({
          items: updatedItems.map((x) => ({
            price: x.discountedPrice ?? x.price,
            quantity: x.quantity,
          })),
        });

        set({ items: updatedItems, totalPrice });
      },

      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),
      setDeliveryAddress: (deliveryAddress) => set({ deliveryAddress }),
      clear: () => set(initialState),
      init: () => set(initialState),
    }),
    {
      name: "cartStore",
      version: 2,
    }
  )
);

export const useCartService = () => {
  const {
    items,
    paymentMethod,
    deliveryMethod,
    deliveryAddress,
    totalPrice,
    addToCart,
    increase,
    decrease,
    removeItem,
    setPaymentMethod,
    setDeliveryMethod,
    setDeliveryAddress,
    clear,
    init,
  } = cartStore();

  return {
    items,
    paymentMethod,
    deliveryMethod,
    deliveryAddress,
    totalPrice,
    addToCart,
    increase,
    decrease,
    removeItem,
    setPaymentMethod,
    setDeliveryMethod,
    setDeliveryAddress,
    clear,
    init,
  };
};
