import axios from "axios";

import { handleResponseErrors } from "./helpers/helpers";
import { clearErrorsAndAlerts, logout, loadUser } from "./auth";
import { setAlert } from "./alert";
import { deleteGroup } from "./group";

import {
  EDIT_USER,
  SET_ERRORS,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from "./types";

// Register User
export const register = userFields => async dispatch => {
  const formData = new FormData();

  for (const key of Object.keys(userFields)) {
    formData.append(key, userFields[key]);
  }

  try {
    const res = await axios.post("/api/user", formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(clearErrorsAndAlerts());
    dispatch(setAlert(`Welcome to Kinekt, ${userFields.name}`, "is-success"));
    dispatch(loadUser());
  } catch (err) {
    dispatch(handleResponseErrors(err));

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

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
      await axios.delete("/api/user");

      dispatch(deleteGroup(true));
      dispatch(logout());
      dispatch(setAlert(`User deleted`, "is-warning"));
    } catch (err) {
      //TODO should this dispatch a USER_ERROR action?
      dispatch(setAlert(`Unable to delete user`, "is-danger"));
    }
  }
};
