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
    setAuthToken();
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Verify User
export const verifyUser = (token, JSWT, history) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ JSWT });

  try {
    dispatch({
      type: AUTH_LOADING
    });

    const res = await axios.post(`/api/auth/verifyUser/${token}`, body, config);

    if (res.data.user.isVerified) {
      dispatch({
        type: SET_USER,
        payload: res.data.user
      });
      dispatch(
        setTextAlert(
          `Welcome to HappenStack, ${res.data.user.name}!`,
          "is-success"
        )
      );
      updateTheme(res.data.user.selectedTheme);
      return history.push("/");
    }
    history.push("/login");
    console.error("Verification API returned 'OK' but user was not verified");
  } catch (err) {
    dispatch(handleResponseErrors(err));
    dispatch({
      type: AUTH_LOADED
    });
    history.push("/login");
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

// Reset password
export const resetPassword = (
  email,
  newPassword,
  confirmNewPassword,
  token,
  history
) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({
    email,
    newPassword,
    confirmNewPassword
  });

  try {
    dispatch({
      type: AUTH_LOADING
    });

    await axios.post(`/api/auth/resetPassword/${token}`, body, config);

    dispatch({
      type: AUTH_LOADED
    });
    dispatch(clearErrors());
    dispatch(
      setTextAlert("Your password has successfully been reset", "is-success")
    );
    history.push("/login");
  } catch (err) {
    dispatch(handleResponseErrors(err));
    dispatch({
      type: AUTH_LOADED
    });
  }
};

export const sendResetInstructions = email => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({
    email
  });

  dispatch({
    type: AUTH_LOADING
  });
  try {
    await axios.post("/api/auth/sendResetInstructions", body, config);
  } catch (err) {
    dispatch(
      setTextAlert(
        "Our messenger falcon was lost in the night. We're terribly sorry, please email us at happenstackhelp@gmail.com from your login email address and we'll get your account sorted personally.",
        "is-success"
      )
    );
  }
  dispatch({
    type: AUTH_LOADED
  });
  dispatch(
    setTextAlert(
      "Our fastest messenger falcon is on the way. Please check your email inbox (and spam folder) and follow the instructions we've sent to finish resetting your password",
      "is-success"
    )
  );
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
        "Our fastest messenger falcon is on the way. Please check your email inbox (and spam folder) and follow the instructions we've sent to finish setting up your account",
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
  setAuthToken();
  dispatch({
    type: LOGOUT
  });
};
