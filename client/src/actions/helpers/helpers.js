import { setAlert } from "../alert";

import { SET_ERRORS } from "../types";

export const handleResponseErrors = err => dispatch => {
  const errors = [];

  if (!err.response.data) return;

  err.response.data.forEach(error => {
    switch (error.param) {
      case "alert": {
        dispatch(setAlert(error.msg, "is-danger"));
        break;
      }
      case "alert-warning": {
        dispatch(setAlert(error.msg, "is-warning"));
        break;
      }
      case "console": {
        console.error(error.msg);
        break;
      }
      default: {
        errors.push(error);
      }
    }
  });

  if (errors) {
    dispatch({
      type: SET_ERRORS,
      payload: errors
    });
  }
};
