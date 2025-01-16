import {jwtDecode} from 'jwt-decode';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp?: number;
}

// // Function to validate the JWT's expiration
// function isTokenExpired(decoded: DecodedToken): boolean {
//   if (!decoded.exp) {
//     // If no expiration is provided, consider the token non-expiring or invalid based on your use case
//     return false;
//   }
  
//   const isExpired = decoded.exp * 1000 < Date.now(); // Convert seconds to milliseconds
//   if (isExpired) {
//     console.error('Token has expired');
//   }
//   return isExpired;
// }

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    // Decode the token
    
    const decoded = jwtDecode<DecodedToken>(token);

    // Check token expiration
    // if (isTokenExpired(decoded)) {
    //   return null;
    // }

    return decoded;
  } catch (error) {

    return null;
  }
};
