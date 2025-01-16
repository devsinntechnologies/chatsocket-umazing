// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useGetUserProfileQuery } from "@/hooks/UseAuth";
import { setUserProfile, logOut } from "@/slice/authSlice";
import AuthDialog from "@/components/auth/AuthDialog";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthProps {
  className?: string;
}

const Auth: React.FC<AuthProps> = ({ className }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.authSlice.user?.id);
  const isLoggedIn = useSelector((state: any) => state.authSlice.isLoggedIn);

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <div className={`${cn(className)} flex gap-2 items-center space-x-1 text-gray-500 text-sm`}>
      {isLoggedIn ? ((
          <div className="flex items-center gap-3 min-h-10">
            LoggedIn
          </div>
        )
      ) : (
        <AuthDialog useTrigger={true} />
      )}
    </div>
  );
};

export default Auth;
