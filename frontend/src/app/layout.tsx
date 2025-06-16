import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillMatch AI",
  description: "Smart resume matching & interview scheduling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <nav className="bg-white shadow px-6 py-4 flex gap-8 items-center">
          <Link
            href="/"
            className="font-bold text-lg text-blue-800 hover:underline"
          >
            SkillMatch AI
          </Link>
          <Link href="/upload" className="hover:underline font-medium text-sm">
            Upload
          </Link>
          <Link href="/match" className="hover:underline font-medium text-sm">
            Match
          </Link>
          <Link
            href="/scheduler"
            className="hover:underline font-medium text-sm"
          >
            Scheduler
          </Link>
          <Link href="/chatbot" className="hover:underline font-medium text-sm">
            Chatbot
          </Link>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
