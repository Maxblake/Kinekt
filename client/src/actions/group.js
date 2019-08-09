import axios from "axios";
import { setAlert } from "./alert";
import { clearErrorsAndAlerts } from "./auth";

import {
  SET_ERRORS,
  GET_GROUP,
  GET_GROUPS,
  GROUP_ERROR,
  CLEAR_GROUP,
  CLEAR_GROUPTYPES
} from "./types";

// Get group by HRID (human readable id), optionally redirect to group's url
export const getGroup = (HRID, history = null) => async dispatch => {
  try {
    const res = await axios.get(`/api/group/${HRID}`);

    dispatch(clearErrorsAndAlerts());

    dispatch({
      type: GET_GROUP,
      payload: res.data.group
    });

    if (history) {
      console.log(res.data);
      history.push(
        `/k/${res.data.groupTypeName.split(" ").join("_")}/group/${HRID}`
      );
    }
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get a list of groups within a given group type
export const getGroups = groupTypeName => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ groupTypeName: groupTypeName.toLowerCase() });

  try {
    const res = await axios.post(`/api/group/list`, body, config);

    dispatch({
      type: GET_GROUPS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch({
      type: CLEAR_GROUPTYPES
    });
  }
};

// Create a group
export const createGroup = (groupFields, history) => async dispatch => {
  const formData = new FormData();

  for (const key of Object.keys(groupFields)) {
    formData.append(key, groupFields[key]);
  }

  //if (groupFields.image) formData.append("image", groupFields.image);

  //const body = JSON.stringify(groupFields);

  try {
    const res = await axios.post("/api/group", formData);

    dispatch(clearErrorsAndAlerts());

    dispatch({
      type: GET_GROUP,
      payload: res.data.group
    });

    history.push(
      `/k/${res.data.groupTypeName.split(" ").join("_")}/group/${
        res.data.group.HRID
      }`
    );
  } catch (err) {
    const errors =
      err.response && err.response.data ? err.response.data.errors : undefined;

    if (errors) {
      dispatch({
        type: SET_ERRORS,
        payload: errors
      });
    }
  }
};

// Delete group
export const deleteGroup = (withoutConfirmation = false) => async dispatch => {
  if (
    withoutConfirmation ||
    window.confirm("Are you sure you would like to delete this group?")
  ) {
    try {
      const res = await axios.delete("/api/group");

      dispatch({ type: CLEAR_GROUP });
      dispatch(setAlert(`Group deleted`, "is-warning"));
    } catch (err) {
      dispatch({
        type: GROUP_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
