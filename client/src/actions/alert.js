import { SET_ALERT, REMOVE_ALERT } from "./types";
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

export const setCustomAlert = (id, alertType, props) => dispatch => {
  dispatch({
    type: SET_ALERT,
    payload: {
      id,
      props,
      alertType
    }
  });
};

export const removeAlert = id => dispatch => {
  dispatch({
    type: REMOVE_ALERT,
    payload: id
  });
};
