import { setAlert } from "../alert";

import { SET_ERRORS } from "../types";

export const handleResponseErrors = err => dispatch => {
  const errors = [];

  err.response.data.forEach(error => {
    switch (error.param) {
      case "alert": {
        dispatch(setAlert(error.msg, "is-danger"));
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
