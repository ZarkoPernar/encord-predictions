import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Encord - Image prediction",
  description: "List and make predictions on images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="px-6 max-w-[960px] mx-auto mt-4 flex gap-20">
          <main className="py-4 flex-1">
            {children}
            <Toaster />
          </main>
        </div>
      </body>
    </html>
  );
}
