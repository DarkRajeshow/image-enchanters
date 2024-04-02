import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat'
});

export const metadata: Metadata = {
  title: "ImageAlchemy.ai - Transforming Images with AI Magic",
  description: "Unlock the power of AI to enhance and refine your images with ImageAlchemy.ai. Remove backgrounds, restore quality, and reimagine your photos effortlessly. Experience the magic of image transformation today!",
  manifest:"/manifest.json"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn("font-Montserrat antialiased", montserrat.variable)}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
