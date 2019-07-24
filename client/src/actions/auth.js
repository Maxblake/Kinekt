import axios from "axios";

import { REGISTER_SUCCESS, REGISTER_FAIL } from "./types";

// Register User
export const register = ({
  name,
  email,
  password,
  about
}) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password, about });

  try {
    const res = await axios.post("/api/user", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;

    if (errors) {
      //TODO pass errors to redux state and handle form ui
      console.log(errors);
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};
