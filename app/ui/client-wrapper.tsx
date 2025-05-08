"use client";

import { useMenu } from "@/app/context/AppContext";
import { Suspense } from "react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { isMenu } = useMenu();

  return (
    <div className={`sm:mt-24 md:mt-32 min-h-[745px] ${isMenu ? 'opacity-30' : ''}`}>
      <div className=" overflow-y-hidden min-h-[745px] h-auto z-9">
        <Suspense>
          {children}
        </Suspense>
      </div>
    </div>
  );
}