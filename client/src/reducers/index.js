import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import alert from "./alert";
import auth from "./auth";

export default combineReducers({
  alert,
  auth,
  errors: errorReducer
});
