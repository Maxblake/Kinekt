import { SET_GROUP_MEMBERS, SET_CURRENT_GROUP } from "../types";

export const addSocketActions = socket => dispatch => {
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
};
