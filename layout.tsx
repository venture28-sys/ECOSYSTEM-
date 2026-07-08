import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Build Me — Africa's Digital Construction Ecosystem",
    template: "%s · Build Me",
  },
  description:
    "Build Me connects clients, contractors, architects, engineers, suppliers, and equipment providers on one secure, AI-powered construction platform — with built-in wallet, escrow, and project management. A Venture 28 company.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
