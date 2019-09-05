import axios from "axios";

import setAuthToken from "../utils/setAuthToken";
import { handleResponseErrors } from "./helpers/helpers";

import {
  AUTH_LOADING,
  SET_USER,
  AUTH_ERROR,
  AUTH_SUCCESS,
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
      type: AUTH_LOADING
    });

    const res = await axios.get(`/api/auth/${checkIfAdmin}`);

    dispatch({
      type: SET_USER,
      payload: res.data
    });

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
      type: AUTH_LOADING
    });

    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: AUTH_SUCCESS,
      payload: res.data
    });
    dispatch(clearErrorsAndAlerts());
    dispatch(loadUser());
  } catch (err) {
    dispatch(handleResponseErrors(err));

    dispatch({
      type: AUTH_ERROR
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
