import axios from "axios";

import { EDIT_USER, SET_ERRORS } from "./types";
import { clearErrors } from "./auth";

// Edit user profile
export const editUser = (name, about) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, about });

  try {
    const res = await axios.put("/api/user", body, config);

    dispatch({
      type: EDIT_USER,
      payload: res.data
    });

    dispatch(clearErrors());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      dispatch({
        type: SET_ERRORS,
        payload: errors
      });
    }
  }
};
