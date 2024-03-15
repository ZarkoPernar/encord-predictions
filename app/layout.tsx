import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
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
      <body
        className={`${inter.className} max-w-[1280px] mx-auto mt-4 flex gap-20`}
      >
        <nav className="flex flex-col gap-2 max-w-[320px]">
          <Link
            href="/"
            className="group flex flex-col gap-1 rounded-lg border border-transparent px-5 py-4 transition-colors hover:bg-gray-100"
          >
            <span className={`font-semibold`}>
              Images{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </span>
            <span className={`max-w-[30ch] text-sm opacity-50`}>
              Find in-depth information about Next.js features and API.
            </span>
          </Link>

          <Link
            href="/predictions"
            className="group flex flex-col gap-1 rounded-lg border border-transparent px-5 py-4 transition-colors hover:bg-gray-100"
          >
            <span className={`font-semibold`}>
              Predictions{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </span>
            <span className={`max-w-[30ch] text-sm opacity-50`}>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </span>
          </Link>
        </nav>
        <main className="py-4">{children}</main>
      </body>
    </html>
  );
}
