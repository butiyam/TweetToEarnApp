// components/Loader.tsx
"use client";
import React from "react";
import Image from "next/image";

export default function Loader() {
  return (
    <div className="flex items-center justify-center bg-black text-white" style={{ padding: '170px'}}>
      <div className="text-center">
        <Image src="/loading.gif" alt="Loading" width={200} height={200} />
        <p className="text-xl mt-4 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
