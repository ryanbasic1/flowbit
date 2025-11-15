import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buchhaltung - Invoice Analytics Dashboard",
  description: "Full Stack Developer Internship Assignment - Invoice analytics and management system",
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
