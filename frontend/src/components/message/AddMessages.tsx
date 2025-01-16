// @ts-nocheck
"use client"
import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetAllUsersQuery } from '@/hooks/UseAuth';
import { getSocket } from '@/lib/socket'; // Assuming you have a socket utility set up
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
interface User {
  id: string;
  name: string;
  email: string;
}

const AddMessages = () => {
  const userId = useSelector((state:RootState)=> state.authSlice.user.id)
  // Get user data from API using the hook
  const { data: users, isLoading, error } = useGetAllUsersQuery({});
  const socket = getSocket(); // Get the socket instance
  // State for selected user, message input, and messages
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [input, setInput] = useState<string>('');
  
  const handleSend = () => {
    if (input.trim() && selectedUser) {
      const messageContent = input.trim();
      socket.emit('sendMessage', {
        receiverId: selectedUser.id, 
        content: messageContent,
      });

      // You can also update the UI with a local message if needed
      // setMessages((prevMessages) => [
      //     ...prevMessages,
      //     { sender: 'You', content: messageContent, time: new Date().toLocaleTimeString() },
      // ]);

      setInput('');
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user); // Set the selected user
    console.log(user);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <button className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
            <Plus color="#ffffff" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex gap-2 items-center">
                <ArrowLeft color="#F47E2F" />
                <span>Select User</span>
              </div>
            </DialogTitle>
            <DialogDescription>
              {isLoading ? (
                <p>Loading users...</p>
              ) : error ? (
                <p className="text-red-500">Error fetching users. Please try again later.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {users.data?.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                    >
                      {user.name} ({user.email})
                    </li>
                  ))}
                </ul>
              )}
            </DialogDescription>
          </DialogHeader>
      {selectedUser ? (
        <div className="mt-4">
          <div>
            <h3 className="font-bold text-lg">Send Message to {selectedUser.name}</h3>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-2 border rounded mt-2"
            rows={4}
          />
          <button
            onClick={handleSend}
            className="mt-2 px-4 py-2 bg-primary text-white rounded"
          >
            Send
          </button>
        </div>
        ) : (<p>NOT SELECTED</p>)
      }
        </DialogContent>
      </Dialog>

      {/* Display message input and send button if a user is selected */}
    </div>
  );
};

export default AddMessages;
