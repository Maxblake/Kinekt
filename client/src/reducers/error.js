import { SET_ERRORS, CLEAR_ERRORS_AND_ALERTS } from "../actions/types";

const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CLEAR_ERRORS_AND_ALERTS: {
      return [];
    }
    case SET_ERRORS: {
      return payload;
    }
    default:
      return state;
  }
}
