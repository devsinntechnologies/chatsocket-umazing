"use client";
import { MousePointerClick } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    
    
    <div className="hidden md:flex flex-col flex-1  items-center justify-center text-gray-500 h-full">
                <MousePointerClick size={48} />
                <p className="text-lg mt-2">Select a chat to start messaging</p>
            </div>
         
  )
}

export default page