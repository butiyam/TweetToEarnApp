// app/loading.tsx
'use client';

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black text-white text-xl">
      <div className="animate-pulse">
         <video
            autoPlay
            loop
            muted
            controls
            
            className="w-full h-full object-fill rounded-[10px]"
            >
            <source src="/loading.mp4" type="video/mp4" />
            Your browser does not support the video tag.
            </video>
      </div>
    </div>
  );
}
