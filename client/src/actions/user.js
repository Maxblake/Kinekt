import axios from "axios";

import { handleResponseErrors } from "./helpers/helpers";
import { clearErrorsAndAlerts, logout, loadUser } from "./auth";
import { setTextAlert } from "./alert";
import { deleteGroup } from "./group";

import {
  AUTH_LOADING,
  AUTH_LOADED,
  UPDATE_USER,
  AUTH_SUCCESS,
  AUTH_ERROR
} from "./types";

// Register User
export const register = userFields => async dispatch => {
  const formData = new FormData();

  for (const key of Object.keys(userFields)) {
    formData.append(key, userFields[key]);
  }

  try {
    dispatch({
      type: AUTH_LOADING
    });

    const res = await axios.post("/api/user", formData);

    dispatch({
      type: AUTH_SUCCESS,
      payload: res.data
    });

    dispatch(clearErrorsAndAlerts());
    dispatch(
      setTextAlert(`Welcome to HappenStack, ${userFields.name}!`, "is-success")
    );
    dispatch(loadUser());
  } catch (err) {
    dispatch(handleResponseErrors(err));

    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Edit user profile
export const editUser = userFields => async dispatch => {
  const formData = new FormData();

  for (const key of Object.keys(userFields)) {
    formData.append(key, userFields[key]);
  }

  try {
    dispatch({
      type: AUTH_LOADING
    });

    const res = await axios.put("/api/user", formData);

    dispatch({
      type: UPDATE_USER,
      payload: res.data
    });

    dispatch(clearErrorsAndAlerts());
    dispatch(setTextAlert("Account settings saved", "is-success"));
  } catch (err) {
    dispatch({
      type: AUTH_LOADED
    });
    dispatch(handleResponseErrors(err));
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

      dispatch(deleteGroup());
      dispatch(logout());
      dispatch(setTextAlert(`User account deleted`, "is-warning"));
    } catch (err) {
      //TODO should this dispatch a USER_ERROR action?
      dispatch(setTextAlert(`Unable to delete user`, "is-danger"));
    }
  }
};
