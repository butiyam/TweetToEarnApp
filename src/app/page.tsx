"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useRouter } from "next/navigation"; // ✅ for redirection
import { useEffect } from "react";

export default function LoginPage() {
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const router = useRouter(); // ✅ init router

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard"); // ✅ redirect when connected
    }
  }, [isConnected, router]);

  return (
    <main className="flex-1 md:mt-0">
    <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Image */}
      <div className="relative w-full md:w-1/2 h-64 md:h-full">
        <Image
          src="/bg-login.png"
          alt="Login Side Image"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Content */}
      <div className="w-full md:w-1/2 h-full bg-black text-white flex flex-col justify-center items-center px-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-3xl font-bold">Welcome to Dyfusion</h1>
          <p className="text-gray-400">Connect your wallet to continue</p>

          <button
            onClick={() => open(isConnected ? { view: "Account" } : undefined)}
            className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-xl text-lg font-semibold transition duration-300"
          >
            {isConnected ? "🌐 Wallet Connected" : "🔐 Connect Wallet"}
          </button>

          <p className="text-sm text-gray-500 mt-4">Powered by Reown AppKit + Wagmi</p>
        </div>
      </div>
    </div>
    </main>
  );
}
