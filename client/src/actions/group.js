import axios from "axios";
import { setAlert } from "./alert";

import { GET_GROUP, GROUP_ERROR } from "./types";

// Get group by HRID (human readable id)
export const getGroup = HRID => async dispatch => {
  try {
    const res = await axios.get(`/api/group/${HRID}`);

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
