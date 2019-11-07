import axios from "axios";

import setAuthToken from "../utils/setAuthToken";
import { updateTheme } from "../utils/theme";
import { handleResponseErrors } from "./helpers/helpers";
import { setTextAlert } from "./alert";

import {
  AUTH_LOADING,
  AUTH_LOADED,
  SET_USER,
  AUTH_ERROR,
  AUTH_SUCCESS,
  CLEAR_ERRORS_AND_ALERTS,
  LOGOUT,
  SET_ERRORS
} from "./types";

// Load User
export const loadUser = (
  checkIfAdmin = false,
  isNewUser = false
) => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
    if (isNewUser) dispatch(sendEmailConfirmation());
  }

  try {
    dispatch({
      type: AUTH_LOADING
    });

    const res = await axios.get(`/api/auth/${checkIfAdmin}`);

    if (res.data.user.isVerified) {
      dispatch({
        type: SET_USER,
        payload: res.data.user
      });

      updateTheme(res.data.user.selectedTheme);

      if (checkIfAdmin) {
        return res.data.isAdmin;
      }
    } else {
      dispatch({
        type: AUTH_ERROR,
        payload: { isVerifying: true }
      });
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

export const sendEmailConfirmation = () => async dispatch => {
  try {
    dispatch({
      type: AUTH_LOADING
    });
    await axios.post("/api/auth/sendEmailConfirmation");

    dispatch({
      type: AUTH_LOADED
    });
    dispatch(
      setTextAlert(
        "Our fastest email messenger falcon is on the way. Please check your email inbox and follow the instructions we've sent to finish setting up your account",
        "is-success"
      )
    );
  } catch (err) {
    dispatch(handleResponseErrors(err));
    dispatch({
      type: AUTH_LOADED
    });
  }
};

export const enterBeta = entryToken => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ entryToken });

  try {
    const res = await axios.post("/api/auth/enterBeta", body, config);
    alert("That's correct. Welcome!");
    localStorage.setItem("entryToken", res.data.entryToken);
    window.location.reload();
  } catch (err) {
    alert("Wrong!");
  }
};

// Clear errors / alerts
export const clearErrorsAndAlerts = () => dispatch => {
  dispatch({
    type: CLEAR_ERRORS_AND_ALERTS
  });
};

export const clearErrors = () => dispatch => {
  dispatch({
    type: SET_ERRORS,
    payload: []
  });
};

// Logout
export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT
  });
};
