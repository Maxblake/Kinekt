import { SET_ALERT, SET_ALERT_RESET, REMOVE_ALERT } from "./types";
import uuid from "uuid";

export const setTextAlert = (msg, alertStatus) => dispatch => {
  const id = uuid.v4();
  dispatch({
    type: SET_ALERT,
    payload: {
      msg,
      alertStatus,
      id,
      alertType: "text"
    }
  });
};

export const setCustomAlert = (
  id,
  alertStatus,
  alertType,
  props
) => dispatch => {
  dispatch({
    type: SET_ALERT,
    payload: {
      id,
      props,
      alertType,
      alertStatus
    }
  });
};

export const setAlertReset = id => dispatch => {
  dispatch({
    type: SET_ALERT_RESET,
    payload: id
  });
};

export const removeAlert = id => dispatch => {
  dispatch({
    type: REMOVE_ALERT,
    payload: id
  });
};
