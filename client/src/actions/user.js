import axios from "axios";

import { EDIT_USER, SET_ERRORS } from "./types";
import { clearErrorsAndAlerts, logout } from "./auth";
import { setAlert } from "./alert";
import { deleteGroup } from "./group";

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

    dispatch(clearErrorsAndAlerts());
    dispatch(setAlert("Account settings saved", "is-success"));
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

// Delete user account
export const deleteUser = () => async dispatch => {
  if (
    window.confirm(
      "Are you sure you would like to delete your account? This cannot be undone."
    )
  ) {
    try {
      const res = await axios.delete("/api/user");

      dispatch(deleteGroup(true));
      dispatch(logout());
      dispatch(setAlert(`User deleted`, "is-warning"));
    } catch (err) {
      //TODO should this dispatch a USER_ERROR action?
      dispatch(setAlert(`Unable to delete user`, "is-danger"));
    }
  }
};
