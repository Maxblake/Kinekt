import axios from "axios";

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SET_ERRORS,
  CLEAR_ERRORS_AND_ALERTS,
  LOGOUT,
  CLEAR_GROUP
} from "./types";

import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });

    // Maybe just keep this call if it's called everywhere
    dispatch(clearErrorsAndAlerts());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      dispatch({
        type: SET_ERRORS,
        payload: errors
      });
    }

    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = ({
  name,
  email,
  password,
  about
}) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password, about });

  try {
    const res = await axios.post("/api/user", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(clearErrorsAndAlerts());

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      dispatch({
        type: SET_ERRORS,
        payload: errors
      });
    }

    dispatch({
      type: REGISTER_FAIL
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
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(clearErrorsAndAlerts());

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      dispatch({
        type: SET_ERRORS,
        payload: errors
      });
    }

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
    type: CLEAR_GROUP
  });
  dispatch({
    type: LOGOUT
  });
};
