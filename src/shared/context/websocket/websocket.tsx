import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType>({ socket: null });

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(`${import.meta.env.VITE_SERVER_URL}`);

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  if (!isConnected) {
    return <div className="text-title">Connecting...</div>;
  }
  return <SocketContext.Provider value={{ socket: socketRef.current }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
