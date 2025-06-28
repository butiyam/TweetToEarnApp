"use client";

import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useRouter } from "next/navigation"; // ✅ for redirection
import { useEffect, useState } from "react";


export default function LoginPage() {
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const router = useRouter(); // ✅ init router
  const [loading, setLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const ref = searchParams.get('referral'); // '123'

  
  useEffect(() => {
    if (isConnected) {
      
      if(!ref){
          router.push(`/dashboard`); // ✅ redirect when connected

      }else{
          router.push(`/dashboard/?referral=${ref}`); // ✅ redirect when connected
      }
    }

     const timer = setTimeout(() => {
       setLoading(false);
      }, 3000); // 3 seconds
  
      return () => clearTimeout(timer);

  }, [isConnected, router, ref]);

  return   loading ? <>
                      <div className="h-screen w-full flex items-center justify-center bg-black text-white text-xl">
                          <div className="animate-pulse text-center">
                            <Image
                            src="/loading.gif"
                            alt="loader"
                            width={500}
                            height={500}
                            className="object-contain"
                          />
                            <p className="text-xl animate-pulse">Loading...</p>
                          </div>
                      </div>
                      </>
              :
            <>            
              <main className="flex-1 md:mt-0">
              <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden">
                {/* Left Image */}
                <div className="relative w-full md:w-1/2 h-64 md:h-full">
                  <Image
                    src="/bg-login.png"
                    sizes='fill'
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
            </>  
  
  
}
