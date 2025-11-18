
// socket.ts
import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token: string) => {
  if (!socket) {
    socket = io('http://192.168.31.54:3000', { auth: { token } });
  }
  return socket;
};
