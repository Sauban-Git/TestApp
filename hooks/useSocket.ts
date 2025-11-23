
import { useEffect, useRef, useState, useCallback } from "react";
import { getSocket } from "@/singleton/socket";
import type { Socket } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const socket = await getSocket();
        socketRef.current = socket;

        if (!isMounted) return;

        socket.on("connect", () => {
          setConnected(true);
        });

        socket.on("disconnect", () => {
          setConnected(false);
        });

        socket.on("connect_error", (err) => {
          console.log("Socket connect error:", err.message);
        });
      } catch (err) {
        console.log("Socket init failed:", err);
      }
    };

    init();

    return () => {
      isMounted = false;
      const socket = socketRef.current;
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
      }
    };
  }, []);

  const sendMessage = useCallback((conversationId: string, message: string) => {
    socketRef.current?.emit("message:new", { conversationId, message });
  }, []);

  const readMessage = useCallback((conversationId: string) => {
    socketRef.current?.emit("message:read", { conversationId });
  }, []);

  const setTyping = useCallback((conversationId: string, status: "start" | "stop") => {
    socketRef.current?.emit("typing:status", { conversationId, typing: status });
  }, []);

  return { connected, sendMessage, readMessage, setTyping };
};

