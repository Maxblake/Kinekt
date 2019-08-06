import axios from "axios";
import { setAlert } from "./alert";
import { clearErrorsAndAlerts } from "./auth";

import { GET_GROUP, GROUP_ERROR, CLEAR_GROUP } from "./types";

// Get group by HRID (human readable id)
export const getGroup = HRID => async dispatch => {
  try {
    const res = await axios.get(`/api/group/${HRID}`);

    dispatch(clearErrorsAndAlerts());

    dispatch({
      type: GET_GROUP,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete group
export const deleteGroup = () => async dispatch => {
  if (window.confirm("Are you sure you would like to delete this group?")) {
    try {
      const res = await axios.delete("/api/group");

      dispatch({ type: CLEAR_GROUP });
      dispatch(setAlert(`Group deleted`, "is-warning"));
    } catch (err) {
      dispatch({
        type: GROUP_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
