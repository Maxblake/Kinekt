import socketIOClient from "socket.io-client";

const getSocket = userId => {
  const socket = socketIOClient("http://localhost:5000");
  socket.emit("setUser", userId);
  return socket;
};

export default getSocket;
