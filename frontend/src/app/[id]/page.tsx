// @ts-nocheck
"use client";
import { useState, useEffect, useRef} from "react";
import { useParams, useRouter } from "next/navigation";
import { Send, ArrowLeft } from "lucide-react";
import { connectSocket, getSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const SingleChat = () => {
  const senderId = useSelector((state: RootState) => state.authSlice?.user?.id);
  const { id: roomId } = useParams(); // Chat room ID
  const router = useRouter();
  const socket = getSocket();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [receiver, setReceiver] = useState(null);

  const bottomRef = useRef(null);

  // Scroll to bottom when the component mounts or messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // Fetch chat room and initial messages
  useEffect(() => {
    // Join and open chat room
    socket.emit("joinChatRoom", roomId);
  
    socket.on("chatRoomUpdated", (data) => {
      console.log("Chat room updated:", data);
      setMessages(data.unreadMessages);
      // Update the last message or other UI as needed
    });
  
    return () => {
      socket.off("chatRoomUpdated");
    };
  }, [roomId]);
  
  useEffect(() => {
    fetchRoomDetails();
    // Mark messages as read
    function markMessagesAsRead(roomId) {
      socket.emit("messageRead", { roomId });
    
      // Optionally, handle confirmation from the server
      socket.on("messageRead", ({ roomId, userId }) => {
        console.log(`Messages in room ${roomId} marked as read by user ${userId}`);
      });
    }
    // Listen for incoming messages
    socket.on("receiveMessage", ({ message }) => {
      if (message?.content && message?.timestamp) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("typing", ({ roomId: typingRoomId, senderId: typingSenderId }) => {
      if (typingRoomId === roomId && typingSenderId !== senderId) {
        setTyping(true);
      }
    });
    
    socket.on("stopTyping", ({ roomId: typingRoomId, senderId: typingSenderId }) => {
      if (typingRoomId === roomId && typingSenderId !== senderId) {
        setTyping(false);
      }
    });
    

    return () => {
      // socket.emit("leaveRoom", { roomId }); // Notify server when leaving the room
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [roomId]);

  // Fetch room details and messages from the server
  const fetchRoomDetails = async () => {
    try {
      const response = await fetch(`http://192.168.43.191:5000/chat/chat_room/${roomId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data.messages || []);
        setReceiver(data.data.receiver || null);
        markMessagesAsRead();
      } else {
        console.error("Failed to fetch room details");
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = () => {
    socket.emit("messageRead", { roomId });
  };

  const handleTyping = () => {
    if (!typing) {
      socket.emit("typing", { roomId });
      }
  };
  
  // Handle stop typing events
  const handleStopTyping = () => {
    if (typing) {
      socket.emit("stopTyping", { roomId });
      setTyping(false);
    }
  };
  // Handle sending messages
  const handleSend = () => {
    if (input.trim()) {
      socket.emit("sendMessage", { roomId, senderId, receiverId: receiver.id, content: input.trim() });
      setInput(""); // Clear input after sending
      handleStopTyping();
    }
  };

  return (
    <div className="flex flex-col w-full lg:w-[70%] md:w-[50%] flex-1 border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-white border-b shadow-md">
        <button onClick={() => router.push("/")} className="text-gray-600 hover:text-black">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg text-primary font-semibold">{ receiver?.username ? receiver?.username  :"Chat Room"}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 h-[calc(100vh-140px)] overflow-y-scroll bg-gray-50">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex flex-col mb-3 ${msg.sender.id === senderId ? "items-end" : "items-start"}`}
        >
          <div
            className={`p-3 rounded-lg shadow-md max-w-xs ${
              msg.sender.id === senderId ? "bg-primary text-white" : "bg-white text-primary"
            }`}
          >
            <p className="text-sm">{msg.content}</p>
            <p className={`text-xs ${
              msg.sender.id === senderId ? "text-gray-200" : "text-gray-800"
            } mt-1`}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
            </p>
          </div>
          {/* <p className="text-green-600 text-xs">{msg.isRead ? "read": "  "}</p> */}
        </div>
      ))}
      {typing && <p className="text-sm text-gray-500">User is typing...</p>}
      
      {/* Invisible div to trigger scroll */}
      <div ref={bottomRef} />
    </div>

      {/* Input */}
      <div className="p-4 bg-white border-t flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={handleTyping}
          onBlur={handleStopTyping}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-lg"
        />
        <button onClick={handleSend} className="ml-3 p-3 rounded-full bg-primary text-white">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default SingleChat;
