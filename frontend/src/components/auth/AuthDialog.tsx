// @ts-nocheck
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Login from "@/components/auth/Login";
import { ArrowLeftIcon } from "lucide-react";

interface AuthDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  useTrigger?: boolean;
}

const AuthDialog: React.FC<AuthDialogProps> = ({
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
  useTrigger = true,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState("login");
  const [resetEmail, setResetEmail] = useState<string>("");

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;

  const handleDialogOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCurrentView("login");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange} className="relative">
      {useTrigger && (
        <DialogTrigger asChild>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary px-6 py-1.5 rounded-full text-white text-sm md:text-base"
          >
            Login
          </button>
        </DialogTrigger>
      )}

      <DialogContent className="overflow-y-scroll sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-center items-center mb-4">
            </div>
            <h2 className="text-lg font-bold text-center">
              {currentView === "login" && "Login with your email & password"}
            </h2>
          </DialogTitle>
        </DialogHeader>
        {currentView === "login" && (
          <Login
            onForgetPassword={() => setCurrentView("forgetPassword")}
            onSignup={() => setCurrentView("signup")}
            onLoginSuccess={() => setIsOpen(false)} // Close dialog on login success
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
