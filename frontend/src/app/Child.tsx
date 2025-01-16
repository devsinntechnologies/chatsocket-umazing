"use client";

import { Suspense, ReactNode, useEffect } from "react";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import MessageSideBar from "@/components/message/MessageSideBar";
import Header from "@/components/Header";
import { connectSocket } from "@/lib/socket";

interface ChildProps {
  children: ReactNode;
}

export default function Child({ children }: ChildProps) {
  useEffect(() => {
    return () => {
    connectSocket()
      
    };
  }, [])

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Header/>
      <div className="flex gap-5 w-full h-[calc(100vh-12vh)] flex-col md:flex-row">
      <MessageSideBar />
        <Suspense fallback={<LoadingSpinner />}>
          <div className="flex flex-1">{children}</div>
        </Suspense>
        </div>
      </Suspense>
    </>
  );
}