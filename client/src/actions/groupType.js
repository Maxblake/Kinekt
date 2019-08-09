import axios from "axios";
import { setAlert } from "./alert";
import { clearErrorsAndAlerts } from "./auth";

import { GET_GROUPTYPES, GROUPTYPE_ERROR, SET_ERRORS } from "./types";

// Get a list of group types ordered and filtered by passed criteria
export const getGroupTypes = ({
  sortBy,
  category,
  searchTerms
}) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ sortBy, category, searchTerms });

  try {
    const res = await axios.post(`/api/group-type/list`, body, config);

    dispatch({
      type: GET_GROUPTYPES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GROUPTYPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get a list of group types ordered and filtered by passed criteria
export const requestGroupType = groupTypeFields => async dispatch => {
  const formData = new FormData();

  for (const key of Object.keys(groupTypeFields)) {
    formData.append(key, groupTypeFields[key]);
  }

  try {
    dispatch(clearErrorsAndAlerts());

    await axios.post(`/api/group-type/request`, formData);

    dispatch(
      setAlert(
        "Your request for a new Group Type has been submitted. Please allow up to 48 hours for a response by email",
        "is-success"
      )
    );
  } catch (err) {
    //TODO receive response error message for.. every api call :)
    const errors =
      err.response && err.response.data ? err.response.data.errors : undefined;

    if (errors) {
      dispatch({
        type: SET_ERRORS,
        payload: errors
      });
    }

    dispatch({
      type: GROUPTYPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
