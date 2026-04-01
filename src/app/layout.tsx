import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/ui/Navbar";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { GSAPProvider } from "@/components/providers/GSAPProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Content Growth Engineer | Portfolio",
  description: "I Build Content That Performs — And Systems That Scale It. Digital Marketer, Content Strategist, and Automation Builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground cursor-none" suppressHydrationWarning>
        <GSAPProvider>
          <CustomCursor />
          <main className="flex-grow">{children}</main>
        </GSAPProvider>
      </body>
    </html>
  );
}
