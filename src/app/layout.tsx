import type { Metadata } from "next";
import {Web3Provider} from '../app/hooks/WebProvider'
import Navbar from "./Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "DyFusion App",
  description: "The most user-friendly chain backed by an appreciating asset.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <body className="flex min-h-screen bg-[#0b0c10] text-white">
        <Navbar/>
        <Web3Provider>
           <main className="flex-1 p-6 mt-12 md:mt-0">{children}</main>
           
        </Web3Provider>
      </body>
    </html>
  );
}
