import {
  SET_ALERT,
  REMOVE_ALERT,
  CLEAR_ERRORS_AND_ALERTS,
  LOGOUT
} from "../actions/types";

const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT: {
      if (
        payload.alertType === "text" &&
        state.find(alert => alert.msg === payload.msg)
      ) {
        return state;
      } else if (state.find(alert => alert.id === payload.id)) {
        return state;
      }
      return [...state, payload];
    }
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);
    case LOGOUT: {
      return [];
    }
    case CLEAR_ERRORS_AND_ALERTS: {
      return state.filter(alert => alert.alertType !== "text");
    }
    default:
      return state;
  }
}
