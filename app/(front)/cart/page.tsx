import { Nav } from "@/components/nav";
import { CartItemList } from "@/components/cart-item-list";

const CartPage = () => {
  return (
    <section className="container mx-auto max-w-310 pt-5 lg:pt-6 pb-0 px-4 xl:px-0 space-y-2 lg:space-y-6">
      <Nav segments={[{ label: "Cart", href: "" }]} />
      <div className="flex flex-col">
        <h2 className="mb-5 lg:mb-6 text-3xl lg:text-5xl uppercase font-black tracking-tight font-secondary">
          Your cart
        </h2>
        <CartItemList />
      </div>
    </section>
  );
};

export default CartPage;
