import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { PencilLine, Undo2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { prisma } from "@/prisma/prisma";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Product details",
  robots: {
    index: false,
    follow: true,
  },
};

interface ProductInfoPageProps {
  params: Promise<{
    productId: string;
  }>;
}

const ProductInfoPage = async ({ params }: ProductInfoPageProps) => {
  const id = (await params).productId;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      brand: { select: { name: true } },
      images: {
        where: { isMain: true },
        select: { url: true },
      },
      variants: {
        include: {
          color: { select: { name: true, hex: true } },
          size: { select: { name: true, value: true } },
        },
      },
    },
  });

  if (!product) {
    return <p>Product with {id} not found</p>;
  }

  return (
    <div className="container min-h-[95vh] mx-auto py-10 px-2 flex flex-col items-center justify-center">
      <Card className="py-12 px-6 h-fit gap-2">
        <div className="flex items-center justify-end gap-2">
          <Link
            href="/products"
            className={`${buttonVariants({
              size: "icon",
              variant: "outline",
            })}`}
            title="Back to products"
            aria-label="Back to products"
          >
            <Undo2 />
          </Link>
          <Link
            href={`/products/${product.id}/edit`}
            className={`${buttonVariants({
              size: "icon",
              variant: "outline",
            })}`}
            title="Edit"
            aria-label="Edit product info"
          >
            <PencilLine />
          </Link>
        </div>

        <CardContent className="grid md:grid-cols-[2fr_3fr] grid-cols-1 gap-5">
          {product.images.length > 0 && (
            <div className="relative aspect-square w-full h-full overflow-hidden">
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 80px"
                className="object-contain"
              />
            </div>
          )}
          <div className="p-5 h-fit flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Badge>Product code: {product.sku}</Badge>
              {product.isArchived && (
                <Badge variant="archived">Archived product</Badge>
              )}
            </div>
            <h2 className="uppercase text-2xl font-bold">{product.name}</h2>
            {product.description ? (
              <section
                dangerouslySetInnerHTML={{ __html: product.description }}
                className="text-muted-foreground"
              />
            ) : (
              <p className="italic">No description provided.</p>
            )}
            <ul className="flex flex-col gap-4">
              <InfoRow label="Category" value={product.category.name} />
              <InfoRow label="Brand" value={product.brand.name} />
              <InfoRow label="Dress style" value={product.dressStyle} />
              <InfoRow label="Gender" value={product.gender} />
              <InfoRow label="Added on" value={formatDate(product.createdAt)} />
              <InfoRow
                label="Last updated at"
                value={formatDate(product.updatedAt)}
              />
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Table>
            <TableCaption>A list of product variants.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Size</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Regular price</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">
                  Price with discount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.variants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell>
                    {variant.size.name} ({variant.size.value})
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: variant.color.hex }}
                      aria-label={`Color: ${variant.color.name}`}
                      role="img"
                    />
                    <span>{variant.color.name}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {variant.quantity}
                  </TableCell>
                  <TableCell className="text-right">${variant.price}</TableCell>
                  <TableCell className="text-right">
                    {variant.discount}%
                  </TableCell>
                  <TableCell className="text-right">
                    ${variant.discountedPrice}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardFooter>
      </Card>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <li className="flex items-baseline justify-between gap-2">
    <p>{label}</p>
    <span className="flex-grow mx-1 border-b-2 border-dotted border-primary/20" />
    <p className="font-medium">{value}</p>
  </li>
);

export default ProductInfoPage;
