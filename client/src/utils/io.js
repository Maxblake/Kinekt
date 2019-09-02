import socketIOClient from "socket.io-client";

const getSocket = () => {
  return socketIOClient("http://localhost:5000");
};

export default getSocket;
