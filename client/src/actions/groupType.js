import axios from "axios";

import { handleResponseErrors } from "./helpers/helpers";
import { clearErrorsAndAlerts } from "./auth";
import { setAlert } from "./alert";

import { GROUPTYPE_LOADING, SET_GROUPTYPES, GROUPTYPE_ERROR } from "./types";

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
    dispatch({
      type: GROUPTYPE_LOADING
    });

    const res = await axios.post(`/api/group-type/list`, body, config);

    dispatch({
      type: SET_GROUPTYPES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GROUPTYPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Request that a new group type get created
export const requestGroupType = (
  groupTypeFields,
  history
) => async dispatch => {
  const formData = new FormData();

  for (const key of Object.keys(groupTypeFields)) {
    formData.append(key, groupTypeFields[key]);
  }

  try {
    dispatch({
      type: GROUPTYPE_LOADING
    });

    await axios.post(`/api/group-type/request`, formData);

    dispatch(clearErrorsAndAlerts());
    dispatch(
      setAlert(
        "Your request for a new Group Type has been submitted. Please allow up to 48 hours for a response by email",
        "is-success"
      )
    );

    history.push("/");
  } catch (err) {
    dispatch(handleResponseErrors(err));

    dispatch({
      type: GROUPTYPE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
