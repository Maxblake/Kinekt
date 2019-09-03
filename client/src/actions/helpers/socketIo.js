import { SET_GROUP_MEMBERS } from "../types";

export const addSocketActions = socket => dispatch => {
  socket.on("updateGroupMembers", updatedMembers =>
    dispatch({
      type: SET_GROUP_MEMBERS,
      payload: updatedMembers
    })
  );
};
