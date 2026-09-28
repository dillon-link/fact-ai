import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fact AI",
  description: "Generate a fun fact with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}