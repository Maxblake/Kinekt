import {
  GET_GROUP,
  GET_GROUPS,
  GROUP_ERROR,
  CLEAR_GROUP
} from "../actions/types";

const initialState = {
  groups: [],
  group: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_GROUPS: {
      return {
        ...state,
        groups: payload.groups,
        loading: false
      };
    }
    case GET_GROUP: {
      return {
        ...state,
        group: payload,
        error: {},
        loading: false
      };
    }
    case GROUP_ERROR: {
      return {
        groups: [],
        group: null,
        error: payload,
        loading: false
      };
    }
    case CLEAR_GROUP: {
      return {
        ...initialState
      };
    }
    default:
      return state;
  }
}
