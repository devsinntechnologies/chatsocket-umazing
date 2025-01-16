"use client"
import { RotatingLines } from 'react-loader-spinner';

const LoadingSpinner = () => (
  <div className="w-full h-screen fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
    <RotatingLines strokeColor="#008080"
            strokeWidth="3"
            animationDuration="0.75"
            width="80"
            visible={true} />
  </div>
);

export default LoadingSpinner;

