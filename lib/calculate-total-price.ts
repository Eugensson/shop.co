export const calculateTotalPrice = ({
  items,
}: {
  items: { price: number; quantity: number }[];
}): number => {
  return Number(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  );
};
