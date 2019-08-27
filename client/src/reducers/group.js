import {
  FETCH_GROUP,
  GET_GROUP,
  GET_GROUPS,
  GROUP_ERROR,
  CLEAR_GROUP,
  LOGOUT
} from "../actions/types";

const initialState = {
  groups: [],
  group: null,
  loading: false,
  error: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_GROUP: {
      return {
        ...state,
        loading: true
      };
    }
    case GET_GROUPS: {
      return {
        ...state,
        groups: payload,
        loading: false,
        error: null
      };
    }
    case GET_GROUP: {
      return {
        ...state,
        group: payload,
        loading: false,
        error: null
      };
    }
    case GROUP_ERROR: {
      return {
        groups: [],
        group: null,
        loading: false,
        error: payload
      };
    }
    case LOGOUT:
    case CLEAR_GROUP: {
      return {
        ...initialState,
        loading: false
      };
    }
    default:
      return state;
  }
}
