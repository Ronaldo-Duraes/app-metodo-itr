import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import AppWrapper from "@/components/layout/AppWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Flashcards Método ITR",
  description: "Aprenda inglês com repetição espaçada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-black text-white min-h-screen flex selection:bg-itr-primary selection:text-white`}>
        <ThemeProvider>
          <AppWrapper>
            {children}
          </AppWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
