import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TTRPG",
  description: "AI-powered tabletop RPG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
