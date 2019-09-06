import {
  GROUP_LOADING,
  SET_GROUP,
  SET_GROUPS,
  SET_GROUP_MEMBERS,
  GROUP_ERROR,
  GROUP_DELETED,
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
    case SET_GROUP_MEMBERS: {
      if (payload.groupId !== state.group._id) return state;
      return {
        ...state,
        group: { ...state.group, users: payload.users }
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
    case GROUP_DELETED:
    case LOGOUT: {
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
