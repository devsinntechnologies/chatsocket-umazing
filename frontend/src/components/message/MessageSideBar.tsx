// @ts-nocheck
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter, useParams } from "next/navigation";
import { useFetchChatsQuery } from "@/hooks/useChat";
import { connectSocket, getSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import AddMessages from "./AddMessages";

const MessageSideBar = () => {
  const userId = useSelector((state) => state.authSlice.user?.id);
  const { data: messagesData, isLoading, error } = useFetchChatsQuery();
  const [rooms, setRooms] = useState([]);
  const router = useRouter();
  const { id } = useParams();
  const [filter, setFilter] = useState("All");
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    const handleNewMessage = (data) => {
      const { roomId, lastMessage } = data;

      setRooms((prevRooms) => {
        const existingRoom = prevRooms.find((room) => room.roomId === roomId);
        if (existingRoom) {
          return prevRooms.map((room) =>
            room.roomId === roomId
              ? { ...room, lastMessage, unreadMessages: (room.unreadMessages || 0) + 1 }
              : room
          );
        }
        return [...prevRooms, { roomId, lastMessage, unreadMessages: 1 }];
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    if (messagesData?.data) {
      setRooms(messagesData.data);
    }
  }, [messagesData]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (filter === "All") return true;
      return room.type?.toLowerCase() === filter.toLowerCase();
    });
  }, [rooms, filter]);

  const activeRoomId = id || null;

  const handleRoomClick = (roomId) => {
    router.push(`/${roomId}`);
  }; 

  if (isLoading) return <div>Loading chats...</div>;
  if (error) return <div>Failed to load chats. Please try again later.</div>;

  if (isMobileView && id) {
    return;
  }

  return (
    <SidebarContent
      rooms={filteredRooms}
      filter={filter}
      setFilter={setFilter}
      activeRoomId={activeRoomId}
      userId={userId}
      onRoomClick={handleRoomClick}
    />
  );
};

const SidebarContent = ({ rooms, filter, setFilter, activeRoomId, userId, onRoomClick }) => {
  return (
    <div className="relative w-full lg:w-[30%] md:w-[50%] h-full bg-gray-50 border-r">
      <div className="h-full py-4 px-4 overflow-y-auto">
        <SearchBar />
        <FilterButtons filter={filter} setFilter={setFilter} />
        <MessageList rooms={rooms} activeRoomId={activeRoomId} onRoomClick={onRoomClick} userId={userId} />
        <div className="absolute right-4 bottom-4"><AddMessages /></div>
      </div>
    </div>
  );
};

// Remaining components (SearchBar, FilterButtons, MessageList, MessageDetails, MessageTimestamp) stay unchanged.


const SearchBar = () => (
  <div className="w-full h-10 overflow-hidden bg-white m-auto flex items-center shadow-xl border-darkGrey rounded-full pr-2 pl-4">
    <div className="w-6 sm:w-8">
      <Search size={20} className="text-darkGrey" />
    </div>
    <input
      type="text"
      placeholder="Search Messages"
      className="w-full outline-none bg-transparent border-0 h-full px-2 text-darkGrey text-xs"
    />
  </div>
);

const FilterButtons = ({ filter, setFilter }) => (
  <div className="w-full flex items-center justify-start gap-3 py-4 text-sm">
    {"All Seller Buyer".split(" ").map((type) => (
      <button
        key={type}
        onClick={() => setFilter(type)}
        className={`transition-all duration-200 ${
          filter === type
            ? "bg-primary rounded-full px-3 py-1 font-bold text-white"
            : "text-primary font-bold"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
);

const MessageList = ({ rooms, activeRoomId, onRoomClick, userId }) => (
  <div className="space-y-2">
    {rooms.map((room) => {
      const isSender = room.lastMessage?.senderId === userId;

      return (
        <div
          onClick={() => onRoomClick(room.roomId)}
          key={room.roomId}
          className={`cursor-pointer p-2 rounded-lg transition-all w-full h-20 justify-center bg-white border border-primary py-2 px-2 grid grid-cols-6 items-center ${
            activeRoomId === room.roomId ? "border-2" : ""
          }`}
        >
          <Avatar>
            <AvatarImage
              src={room?.users?.[0]?.avatarUrl || ""}
              alt={room?.users?.[0]?.email || ""}
              className="w-8 h-8 text-sm bg-gradient-to-t to-gradientTo from-gradientFrom"
            />
            <AvatarFallback className="bg-primary text-white">
              {room?.roomName?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <MessageDetails room={room} userId={userId} />

          <MessageTimestamp
            timestamp={new Date(room.lastMessage?.timestamp)}
            unreadMessages={room.unreadMessages || 0}
            isSender={isSender}
          />
        </div>
      );
    })}
  </div>
);


const MessageDetails = ({ room, userId }) => {
  const isSender = room.lastMessage.senderId === userId;
  const messageContent = isSender
    ? `You: ${room.lastMessage.content}`
    : room.lastMessage.content;

  return (
    <div className="col-span-4 text-[10px] h-fit">
      <div className="flex gap-1">
        <h1 className="font-semibold text-primary text-base">
          {room.roomName || "Chat"}
        </h1>
      </div>
      <h2 className="text-primary text-sm">
        {messageContent.length > 29
          ? `${messageContent.substring(0, 28)}...`
          : messageContent}
      </h2>
    </div>
  );
};

const MessageTimestamp = ({ timestamp, unreadMessages, isSender }) => {
  const formatTimestamp = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = messageDate.toLocaleDateString() === today.toLocaleDateString();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = messageDate.toLocaleDateString() === yesterday.toLocaleDateString();

    const formattedTime = messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,  // Force AM/PM format
    });

    if (isToday) {
      return `Today ${formattedTime}`;
    }
    if (isYesterday) {
      return `Yesterday ${formattedTime}`;
    }

    return `${messageDate.toLocaleDateString()} ${formattedTime}`;
  };

  return (
    <div className="flex items-center justify-center gap-1 flex-col text-primary font-bold text-center text-xs">
      <h1>{formatTimestamp(timestamp)}</h1>
      {!isSender && unreadMessages > 0 && (
        <div className="p-1 size-6 text-white bg-primary rounded-full">
          {unreadMessages}
        </div>
      )}
    </div>
  );
};

export default MessageSideBar;
