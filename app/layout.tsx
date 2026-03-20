import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MM Editor",
  description: "Blokový editor článků pro Shoptet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
