import axios from "axios";

import { setTextAlert, setCustomAlert } from "../alert";

import { SET_ERRORS, REQUEST_ENTRY } from "../types";

export const handleResponseErrors = err => dispatch => {
  const errors = [];

  if (!err.response || !err.response.data || !Array.isArray(err.response.data))
    return;

  err.response.data.forEach(error => {
    switch (error.param) {
      case "alert": {
        dispatch(setTextAlert(error.msg, "is-danger"));
        break;
      }
      case "alert-warning": {
        dispatch(setTextAlert(error.msg, "is-warning"));
        break;
      }
      case "alert-requestEntry": {
        dispatch(
          setCustomAlert(error.payload.groupId, "is-info", "requestEntry", {
            ...error.payload
          })
        );
        dispatch({
          type: REQUEST_ENTRY,
          payload: error.payload.groupId
        });
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

export const getAddressFromCoords = async (lat, lng) => {
  return new Promise(res => {
    axios
      .get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&lat=${lat}&lon=${lng}`
      )
      .then(response => res(response));
  });
};
