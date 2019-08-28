import axios from "axios";
import { setAlert } from "./alert";
import { clearErrorsAndAlerts } from "./auth";

import { GROUPTYPE_ERROR } from "./types";

// Get all requested group types
export const getRequestedGroupTypes = () => async dispatch => {
  try {
    const res = await axios.get(`/api/admin/get-requested-group-types`);
    return res.data;
  } catch (err) {
    // set alert
  }
};

// Send a list of requested group types to be removed or converted to regular group types
export const processRequestedGroupTypes = groupTypeDecisions => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ groupTypeDecisions });

  try {
    await axios.post(`/api/admin/process-requested-group-types`, body, config);

    dispatch(clearErrorsAndAlerts());
    dispatch(setAlert("Group types processed", "is-success"));
  } catch (err) {
    dispatch({
      type: GROUPTYPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
