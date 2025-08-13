import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatId = (id: string) => {
  return `...${id.substring(id.length - 6)}`;
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

export const formatDate = (dateInput: Date | string) => {
  const date = new Date(dateInput);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  return date
    .toLocaleDateString("en-US", options)
    .replace(",", "")
    .replace(" р.", "");
};

export const handleUnknownError = (error: unknown) => {
  if (error instanceof Error) {
    throw error;
  }
  throw new Error("An internal error has occurred. Please try again.");
};
