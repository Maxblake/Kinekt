import { combineReducers } from "redux";
import authReducer from "./authReducer";
import error from "./error";
import alert from "./alert";
import auth from "./auth";

export default combineReducers({
  alert,
  auth,
  error
});
