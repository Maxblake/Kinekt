import {
  GET_GROUPS,
  GET_GROUPTYPE,
  GET_GROUPTYPES,
  GROUPTYPE_ERROR,
  CLEAR_GROUPTYPES
} from "../actions/types";

const initialState = {
  groupTypes: [],
  groupType: null,
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
    case GET_GROUPTYPE:
    case GET_GROUPS: {
      return {
        ...state,
        groupType: payload.groupType,
        loading: false
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
    case CLEAR_GROUPTYPES: {
      return {
        groupTypes: [],
        groupType: null,
        loading: false,
        error: {}
      };
    }
    default:
      return state;
  }
}
