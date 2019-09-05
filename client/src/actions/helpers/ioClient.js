import socketIOClient from "socket.io-client";

import { SET_GROUP_MEMBERS, SET_CURRENT_GROUP, SET_SOCKET } from "../types";

export const openSocket = () => dispatch => {
  const socket = socketIOClient("http://localhost:5000");
  addSocketActions(socket);

  dispatch({
    type: SET_SOCKET,
    payload: socket
  });
};

const addSocketActions = socket => dispatch => {
  socket.on("updateGroupMembers", updatedMembers =>
    dispatch({
      type: SET_GROUP_MEMBERS,
      payload: updatedMembers
    })
  );

  socket.on("updateCurrentGroup", currentGroup =>
    dispatch({
      type: SET_CURRENT_GROUP,
      payload: currentGroup
    })
  );

  socket.on("setGroupAndUserNumbers", groupAndUserNumbers => console.log("yo"));
};
