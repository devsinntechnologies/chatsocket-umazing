import React, { useState, useEffect } from "react";
import { MailIcon, LockKeyhole, EyeOffIcon, EyeIcon } from "lucide-react";
import { useLoginMutation } from "@/hooks/UseAuth";
import { useDispatch } from "react-redux";
import { setLogin } from "@/slice/authSlice";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onForgetPassword: () => void; // Type for onForgetPassword prop
  onSignup: () => void; // Type for onSignup prop
  onLoginSuccess: () => void; // Type for onLoginSuccess prop
}

const Login: React.FC<LoginProps> = ({ onForgetPassword, onSignup, onLoginSuccess }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [
    login,
    { isSuccess, error: loginError, data: responseData, isLoading },
  ] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) {
      toast({
        title: "Logging in",
        description: "Please wait while we log you in.",
        duration: 2000,
      });
    } else if (isSuccess) {
      if (responseData?.success) {
        toast({
          title: "Login Successful",
          description: "",
          duration: 2000,
        });
        dispatch(setLogin({ token: responseData?.token }));
        onLoginSuccess(); // Close the dialog after success
      } else {
        toast({
          title: "Login Failed",
          description: responseData?.message || "Failed to login",
          duration: 2000,
        });
      }
    } else if (loginError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to login",
        duration: 2000,
      });
    }
  }, [
    isSuccess,
    isLoading,
    loginError,
    responseData,
    toast,
    dispatch,
    onLoginSuccess,
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex items-center border border-gray-300 p-2 rounded-md">
          <MailIcon className="text-gray-500 mr-2" />
          <input
            type="email"
            className="w-full focus:outline-none text-sm sm:text-base"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative w-full flex items-center border border-gray-300 p-2 rounded-md">
          <LockKeyhole className="text-gray-500 mr-2" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full focus:outline-none"
          />
          {/* Show/Hide Password Button */}
          {password && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="w-6 absolute inset-y-0 right-3 flex items-center justify-center text-gray-600"
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          )}
        </div>

        <div className="text-right">
          <button
            type="button"
            className="text-sm text-blue-500 hover:underline"
            onClick={onForgetPassword}
          >
            Forget Password?
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-full text-sm sm:text-base"
        >
          Login
        </button>
      </form>
      {/* <div className="my-4 text-center">
        <p>Or</p>
      </div>
      <div className="space-y-2">
        <button className="w-full text-primary py-2 rounded-full hover:bg-primary hover:text-white border border-primary text-sm sm:text-base">
          Login with Google
        </button>
        <button className="w-full text-primary py-2 rounded-full hover:bg-primary hover:text-white border border-primary text-sm sm:text-base">
          Login with Mobile number
        </button>
      </div> */}
      <div className="mt-4 text-center">
        <p>
          Don’t have an account?{" "}
          <button onClick={onSignup} className="text-blue-500 hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </>
  );
};

export default Login;
