import {
  GROUPTYPE_LOADING,
  GROUPTYPE_LOADED,
  SET_GROUPTYPE,
  SET_GROUPTYPES,
  CONCAT_GROUPTYPES,
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
    case GROUPTYPE_LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    case GROUPTYPE_LOADED: {
      return {
        ...state,
        loading: false
      };
    }
    case SET_GROUPTYPES: {
      return {
        ...state,
        groupTypes: payload,
        loading: false,
        error: null
      };
    }
    case CONCAT_GROUPTYPES: {
      return {
        ...state,
        groupTypes: [...state.groupTypes, ...payload],
        loading: false,
        error: null
      };
    }
    case SET_GROUPTYPE: {
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
