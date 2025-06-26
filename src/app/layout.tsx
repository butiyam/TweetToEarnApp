import type { Metadata } from "next";
import {Web3Provider} from '../app/hooks/WebProvider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
          <ToastContainer
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" />
        <Web3Provider>
           {children}
        </Web3Provider>
      </body>
    </html>
  );
}
