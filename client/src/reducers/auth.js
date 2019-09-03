import {
  AUTH_LOADING,
  AUTH_LOADED,
  SET_USER,
  AUTH_ERROR,
  AUTH_SUCCESS,
  LOGOUT,
  UPDATE_USER,
  SET_CURRENT_GROUP,
  SET_GROUP
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  user: null,
  socket: null,
  loading: false
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case AUTH_LOADING:
      return {
        ...state,
        loading: true
      };
    case AUTH_LOADED:
      return {
        ...state,
        loading: false
      };
    case SET_USER:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case UPDATE_USER:
      return {
        ...state,
        user: payload,
        loading: false
      };
    case SET_CURRENT_GROUP:
      return {
        ...state,
        user: { ...state.user, currentGroup: payload }
      };
    case AUTH_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem("token");
      if (!!state.socket) {
        state.socket.disconnect();
      }
      return {
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        socket: null
      };
    case SET_GROUP:
      if (!!state.socket) {
        state.socket.emit("joinGroup", payload._id);
      }
      return state;
    default:
      return state;
  }
}
