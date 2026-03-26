import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ITR | Inglês em Tempo Recorde",
  description: "Aprenda inglês com o Método ITR de forma rápida e eficiente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-black text-white min-h-screen flex selection:bg-emerald-500/30 selection:text-emerald-200`}>
        <ThemeProvider>
          <main className="flex-1 relative overflow-y-auto h-screen scroll-smooth">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
