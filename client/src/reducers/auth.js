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
  GET_GROUP_NOTICES,
  SET_GROUP,
  REQUEST_ENTRY
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
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
      state.socket.emit("setUser", localStorage.getItem("token"));
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
        token: payload.token,
        isAuthenticated: payload.isVerified,
        loading: false
      };
    case AUTH_ERROR:
      if (!!payload && payload.isVerifying) {
        return {
          ...state,
          isAuthenticated: false,
          loading: false,
          user: null
        };
      }
    case LOGOUT:
      localStorage.removeItem("token");
      state.socket.emit("logout");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case SET_GROUP:
      if (payload) {
        state.socket.emit("joinGroup", payload._id);
      }
      return state;
    case GET_GROUP_NOTICES:
      state.socket.emit("getGroupNotices", payload);
      return state;
    case REQUEST_ENTRY:
      state.socket.emit("requestEntry", payload);
      return state;
    default:
      return state;
  }
}
