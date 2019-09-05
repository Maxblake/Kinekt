import {
  AUTH_LOADING,
  AUTH_LOADED,
  SET_USER,
  SET_SOCKET,
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
      state.socket.emit("setUser", payload._id);
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false
      };
    case SET_SOCKET:
      return {
        ...state,
        socket: payload
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
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case SET_GROUP:
      state.socket.emit("joinGroup", payload._id);
      return state;
    default:
      return state;
  }
}
