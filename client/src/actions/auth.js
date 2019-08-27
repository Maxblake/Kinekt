import axios from "axios";

import setAuthToken from "../utils/setAuthToken";
import { handleResponseErrors } from "./helpers/helpers";

import {
  FETCH_AUTH,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SET_ERRORS,
  CLEAR_ERRORS_AND_ALERTS,
  LOGOUT
} from "./types";

// Load User
export const loadUser = (checkIfAdmin = false) => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    dispatch({
      type: FETCH_AUTH
    });

    const res = await axios.get(`/api/auth/${checkIfAdmin}`);

    dispatch({
      type: USER_LOADED,
      payload: res.data.user
    });

    // Maybe just keep this call if it's called everywhere
    dispatch(clearErrorsAndAlerts());

    if (checkIfAdmin) {
      return res.data.isAdmin;
    }
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    dispatch({
      type: FETCH_AUTH
    });

    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(clearErrorsAndAlerts());

    dispatch(loadUser());
  } catch (err) {
    dispatch(handleResponseErrors(err));

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Clear errors
export const clearErrorsAndAlerts = () => dispatch => {
  dispatch({
    type: CLEAR_ERRORS_AND_ALERTS
  });
};

// Logout
export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT
  });
};
