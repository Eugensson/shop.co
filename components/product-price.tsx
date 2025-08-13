import { memo } from "react";

import { formatCurrency } from "@/lib/utils";

interface ProductPriceProps {
  price: number;
  discountedPrice: number;
}

export const ProductPrice = memo(
  ({ price, discountedPrice }: ProductPriceProps) => {
    return (
      <>
        {price !== discountedPrice ? (
          <div className="flex flex-col">
            <p
              className="text-xs text-muted-foreground line-through"
              title={`Регулярна ціна ${formatCurrency(price)} гривень`}
              aria-label={`Регулярна ціна ${formatCurrency(price)} гривень`}
            >
              <span className="align-top text-xs">₴&nbsp;</span>
              <span className="text-muted-foreground line-through">
                {formatCurrency(price)}
              </span>
            </p>
            <p
              className="text-destructive"
              title={`Ціна зі знижкою ${formatCurrency(
                discountedPrice
              )} гривень`}
              aria-label={`Ціна зі знижкою ${formatCurrency(
                discountedPrice
              )} гривень`}
            >
              <span className="text-lg">{formatCurrency(discountedPrice)}</span>
            </p>
          </div>
        ) : (
          <p
            className="text-foreground"
            title={`Регулярна ціна ${formatCurrency(price)} гривень`}
            aria-label={`Регулярна ціна ${formatCurrency(price)} гривень`}
          >
            <span className="text-lg">{formatCurrency(price)}</span>
          </p>
        )}
      </>
    );
  }
);

ProductPrice.displayName = "ProductPrice";
