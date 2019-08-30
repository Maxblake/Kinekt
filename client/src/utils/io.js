import socketIOClient from "socket.io-client";

class io {
  constructor() {
    this.socket = socketIOClient("http://localhost:5001");
  }

  start() {}
}

export default io;
