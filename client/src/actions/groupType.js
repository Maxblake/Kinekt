import axios from "axios";

import { handleResponseErrors } from "./helpers/helpers";
import { clearErrorsAndAlerts } from "./auth";
import { setTextAlert } from "./alert";

import {
  GROUPTYPE_LOADING,
  GROUPTYPE_LOADED,
  SET_GROUPTYPE,
  SET_GROUPTYPES,
  CONCAT_GROUPTYPES,
  GROUPTYPE_ERROR
} from "./types";

// Get a list of group types ordered and filtered by passed criteria
export const getGroupTypes = (
  { category, searchTerms },
  seenGroupTypes = []
) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ category, searchTerms, seenGroupTypes });

  try {
    dispatch({
      type: GROUPTYPE_LOADING
    });

    const res = await axios.post(`/api/group-type/list`, body, config);

    dispatch({
      type: seenGroupTypes.length > 0 ? CONCAT_GROUPTYPES : SET_GROUPTYPES,
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
      setTextAlert(
        "Your request for a new group type has been submitted. Please allow up to 48 hours for a moderator to make sure it's good to go.",
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

// Edit a group type
export const editGroupType = (
  groupTypeFields,
  groupTypeId
) => async dispatch => {
  const formData = new FormData();

  for (const key of Object.keys(groupTypeFields)) {
    formData.append(key, groupTypeFields[key]);
  }

  try {
    dispatch({
      type: GROUPTYPE_LOADING
    });

    const res = await axios.put(`/api/group-type/${groupTypeId}`, formData);

    dispatch({
      type: SET_GROUPTYPE,
      payload: res.data
    });

    dispatch(clearErrorsAndAlerts());
    dispatch(
      setTextAlert(
        `Group Type, ${res.data.name}, has been updated`,
        "is-success"
      )
    );
  } catch (err) {
    dispatch(handleResponseErrors(err));
    dispatch({
      type: GROUPTYPE_LOADED
    });
  }
};
