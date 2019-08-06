import { combineReducers } from "redux";
import authReducer from "./authReducer";
import error from "./error";
import alert from "./alert";
import auth from "./auth";
import group from "./group";
import groupType from "./groupType";

export default combineReducers({
  alert,
  auth,
  error,
  group,
  groupType
});
