import type { Metadata } from "next";
import { Anton, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Victor Udechukwu — Senior Full Stack JavaScript Developer",
  description:
    "Full Stack JavaScript Developer with 6+ years shipping production-grade web and mobile apps end-to-end across fintech, e-commerce, logistics, EdTech, and SaaS. AI-first engineer working with Claude Code and agentic workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivo.variable} ${plexMono.variable} antialiased`}
    >
      <body className="grain">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
