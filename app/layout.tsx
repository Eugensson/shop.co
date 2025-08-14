import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next";
import { Inter, Montserrat } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

import { auth } from "@/auth";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["cyrillic"],
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "shop.co",
    template: "%s | shop.co",
  },
  description:
    "Dress the Way You Feel Stylish collections from world-renowned brands to inspire you. Shop.co is the ultimate destination for all your fashion needs.",
  openGraph: {
    siteName: "shop.co",
    type: "website",
    url: "https://shop.co",
    title: "shop.co",
    description:
      "Dress the Way You Feel Stylish collections from world-renowned brands to inspire you. Shop.co is the ultimate destination for all your fashion needs.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "shop.co",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "shop.co",
    description:
      "Dress the Way You Feel Stylish collections from world-renowned brands to inspire you. Shop.co is the ultimate destination for all your fashion needs.",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={`${inter.variable} ${montserrat.variable} antialiased`}
        >
          {children}
          <Toaster />
          <Analytics />
        </body>
      </html>
    </SessionProvider>
  );
}
