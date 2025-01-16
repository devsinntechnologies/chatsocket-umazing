import React from 'react';
import Auth from './Auth';
import { useGetUserProfileQuery } from '@/hooks/UseAuth';

const Header = () => {
  const { data, isLoading, isError } = useGetUserProfileQuery({});

  let userName = 'Guest'; // Default username

  if (isLoading) {
    userName = 'Loading...';
  } else if (isError || !data?.success) {
    userName = 'Error fetching user';
  } else if (data.success && data.data?.username) {
    userName = data.data.username;
  }

  return (
    <div className='px-10 w-full h-[10vh] text-3xl text-primary flex justify-between items-center font-extrabold shadow shadow-b-lg'>
      <div className='flex items-center gap-4'>
        <span>Demo Chat</span>
        <span className=' text-primary text-xl font-semibold'>| {userName}</span>
      </div>
      <Auth />
    </div>
  );
};

export default Header;
