import {
  GROUP_LOADING,
  SET_GROUP,
  SET_GROUPS,
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
    case GROUP_LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    case SET_GROUPS: {
      return {
        ...state,
        groups: payload,
        loading: false,
        error: null
      };
    }
    case SET_GROUP: {
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
        ...state,
        group: null,
        loading: false
      };
    }
    default:
      return state;
  }
}
