import {
  GET_GROUPTYPES,
  GROUPTYPE_ERROR,
  CLEAR_GROUPTYPES
} from "../actions/types";

const initialState = {
  groupTypes: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_GROUPTYPES: {
      return {
        ...state,
        groupTypes: payload,
        loading: false
      };
    }
    case GROUPTYPE_ERROR: {
      return {
        groupTypes: null,
        error: payload,
        loading: false
      };
    }
    case CLEAR_GROUPTYPES: {
      return {
        groupTypes: [],
        loading: false,
        error: {}
      };
    }
    default:
      return state;
  }
}
