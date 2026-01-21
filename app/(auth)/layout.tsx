'use client';

import React from 'react';
import { ToastContainer } from 'react-toast';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090b] text-white font-Inter flex items-center justify-center px-6 py-10">
      <ToastContainer></ToastContainer>
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-[10%] -left-[10%] h-[600px] w-[600px] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-yellow-500/10 blur-[100px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[20%] h-[300px] w-[300px] rounded-full bg-purple-900/10 blur-[80px] mix-blend-screen" />
      </div>
      <div className="relative z-10">
        <div
          className="
            relative
            rounded-3xl
            p-6 sm:p-8
            bg-[#18181ba6]
            backdrop-blur-[20px]
            border border-white/10
            ring-1 ring-white/5
          "
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-v1-primary-yellow to-transparent" />
          {children}
        </div>
      </div>
    </div>
  );
}
