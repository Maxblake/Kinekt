import {
  FETCH_GROUPTYPE,
  GET_GROUPTYPE,
  GET_GROUPTYPES,
  GROUPTYPE_ERROR
} from "../actions/types";

const initialState = {
  groupTypes: [],
  groupType: null,
  loading: false,
  error: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_GROUPTYPE: {
      return {
        ...state,
        loading: true
      };
    }
    case GET_GROUPTYPES: {
      return {
        ...state,
        groupTypes: payload,
        loading: false,
        error: null
      };
    }
    case GET_GROUPTYPE: {
      return {
        ...state,
        groupType: payload,
        loading: false,
        error: null
      };
    }
    case GROUPTYPE_ERROR: {
      return {
        groupTypes: [],
        groupType: null,
        error: payload,
        loading: false
      };
    }
    default:
      return state;
  }
}
