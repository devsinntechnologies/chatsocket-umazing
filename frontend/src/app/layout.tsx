import StoreProvider from "./Provider";
import { ReactNode } from "react";
import "./globals.css";
import Child from "./Child";
import { Toaster } from "@/components/ui/toaster";

interface RootLayoutProps {
  children: ReactNode; // Define the type for children
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body >
      <StoreProvider>
       {/* <Toaster> */}
       <Child> {children} </Child>
       {/* </Toaster> */}
        </StoreProvider>
      </body>
    </html>
  );
}
