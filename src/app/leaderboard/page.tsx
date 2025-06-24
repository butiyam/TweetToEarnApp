"use client";
import { useEffect, useState } from "react";
import Leaderboard from "../../../components/Leaderboard";
import Navbar from "../Navbar";
import Image from "next/image";

//import ProtectedRoute from "../../../components/ProtectedRoute";

export default function Page() {

    const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const timer = setTimeout(() => {
     setLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return  loading ?
        <>
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
          <><Navbar />
           <main className="flex-1 mt-15 md:mt-0">
           <Leaderboard />
          </main>
        </>
        
        ;
}
