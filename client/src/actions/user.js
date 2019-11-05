import axios from "axios";

import { handleResponseErrors } from "./helpers/helpers";
import { clearErrorsAndAlerts, clearErrors, logout, loadUser } from "./auth";
import { setTextAlert } from "./alert";
import { deleteGroup } from "./group";

import {
  AUTH_LOADING,
  AUTH_LOADED,
  UPDATE_USER,
  AUTH_SUCCESS,
  AUTH_ERROR,
  SET_USER
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

export const buyLocks = (charge, opts) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ charge, opts });

  try {
    const res = await axios.post("/api/auth/post-stripe-payment", body, config);
    console.log(res.data.payment);
    dispatch(
      setTextAlert(
        `Success! Your payment has been processed and ${res.data.payment.groupLocksReceived} group locks have been added to your account. Thank you!`,
        "is-success"
      )
    );
    dispatch({
      type: SET_USER,
      payload: res.data.user
    });
  } catch (err) {
    dispatch(
      setTextAlert("There was an error processing your payment", "is-danger")
    );
    console.error(err);
  }
};

export const isReferralCodeValid = referralCode => async dispatch => {
  if (referralCode === "") {
    dispatch(clearErrors());
    return true;
  }

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ referralCode });

  try {
    await axios.put("/api/user/is-rc-valid", body, config);
    dispatch(clearErrors());
    return true;
  } catch (err) {
    dispatch(handleResponseErrors(err));
    return false;
  }
};
