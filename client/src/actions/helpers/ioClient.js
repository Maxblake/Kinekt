import socketIOClient from "socket.io-client";

import {
  SET_SOCKET,
  SET_CURRENT_GROUP,
  SET_GROUP_AND_USER_NUMBERS,
  SET_GROUP_MEMBERS,
  SET_GROUP_NOTICES,
  SET_NEW_GROUP_CHAT,
  SET_GROUP,
  SET_GROUPTYPE
} from "../types";

export const openSocket = () => dispatch => {
  const url =
    process.env.NODE_ENV === "production"
      ? "https://guarded-oasis-93378.herokuapp.com/"
      : "http://localhost:5000/";

  const socket = socketIOClient(url, {
    transports: ["websocket"]
  });
  dispatch(addSocketActions(socket));

  dispatch({
    type: SET_SOCKET,
    payload: socket
  });
};

export const adjustStateForKickedUser = () => dispatch => {
  dispatch({
    type: SET_GROUP,
    payload: null
  });
  dispatch({
    type: SET_GROUPTYPE,
    payload: null
  });
  dispatch({
    type: SET_CURRENT_GROUP,
    payload: null
  });
};

//TODO shouldn't these actions be removed on unmount?

const addSocketActions = socket => dispatch => {
  socket.on("updateGroupMembers", updatedMembers => {
    dispatch({
      type: SET_GROUP_MEMBERS,
      payload: updatedMembers
    });
  });

  socket.on("updateGroupNotices", updatedNotices => {
    dispatch({
      type: SET_GROUP_NOTICES,
      payload: updatedNotices
    });
  });

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

  socket.on("receiveMessage", message =>
    dispatch({
      type: SET_NEW_GROUP_CHAT,
      payload: message
    })
  );
};
