import type { Metadata } from "next";
import { Vend_Sans } from "next/font/google";
import "./globals.css";

const vendSans = Vend_Sans({
  variable: "--font-vend-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evolution",
  description: "Evolution admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${vendSans.variable} h-full antialiased`}>
      <body className={`${vendSans.className} min-h-full font-sans`}>
        {children}
      </body>
    </html>
  );
}
