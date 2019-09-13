import {
  GROUP_LOADING,
  GROUP_LOADED,
  SET_GROUP,
  SET_GROUPS,
  SET_CURRENT_GROUP,
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
    case GROUP_LOADED: {
      return {
        ...state,
        loading: false
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
    case SET_CURRENT_GROUP: {
      return {
        ...state,
        group: payload === null ? null : state.group
      };
    }
    case SET_GROUP_MEMBERS: {
      //TODO clean this up
      if (!state.group) return state;

      if (state.group && payload.groupId !== state.group._id) {
        console.log("THIS SHOULD NEVER HIT");
        return state;
      }
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
