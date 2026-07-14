import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "sonner";


const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reflect",
  description: "A Journaling App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
       <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
        <div className="bg-[url('/bg.jpg')] opacity-50 fixed -z-10 inset-0"/>
        <Header/>
        <main className="min-h-screen">{children}</main>
        <Toaster richColors/>
        <footer className="bg-orange-300 py-12 bg-opacity-10">
          <div className="mx-auto px-4 text-center text-gray-900">
            <p>Made by DamicodesX</p>
          </div>
        </footer>        
        </ClerkProvider>
        </body>
    </html>
   
  );
}
