// app/loading.tsx
'use client';
import Image from 'next/image';

export default function Loading() {
  return (
          <div className="h-screen w-full flex items-center justify-center bg-black text-white text-xl">
            <div className="animate-pulse">
              <Image
              src="/loading.gif"
              alt="loader"
              width={500}
              height={500}
              className="object-contain"
            />
            </div>
          </div>
  );
}
