import socketIOClient from "socket.io-client";

import {
  SET_SOCKET,
  SET_CURRENT_GROUP,
  SET_GROUP_AND_USER_NUMBERS,
  SET_GROUP_MEMBERS,
  SET_GROUP,
  SET_GROUPTYPE
} from "../types";

export const openSocket = () => dispatch => {
  const socket = socketIOClient("http://localhost:5000");
  dispatch(addSocketActions(socket));

  dispatch({
    type: SET_SOCKET,
    payload: socket
  });
};

export const clearGroupAndGroupTypeStates = () => dispatch => {
  dispatch({
    type: SET_GROUP,
    payload: null
  });
  dispatch({
    type: SET_GROUPTYPE,
    payload: null
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

  socket.on("setGroupAndUserNumbers", groupAndUserNumbers =>
    dispatch({
      type: SET_GROUP_AND_USER_NUMBERS,
      payload: groupAndUserNumbers
    })
  );
};
