"use client";

import { useEffect } from "react";

import { useBrowsingHistory } from "@/hooks/use-browsing-history";

export const AddToHistory = ({
  id,
  category,
}: {
  id: string;
  category: string;
}) => {
  const { addItem } = useBrowsingHistory();

  useEffect(() => {
    if (id && category) {
      addItem({ id, category });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
