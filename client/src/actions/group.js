import axios from "axios";

import { handleResponseErrors } from "./helpers/helpers";
import { clearErrorsAndAlerts } from "./auth";
import { setAlert } from "./alert";

import {
  GROUP_LOADING,
  SET_GROUP,
  SET_GROUPS,
  SET_GROUPTYPE,
  GROUP_ERROR,
  CLEAR_GROUP
} from "./types";

// Get group by HRID (human readable id)
export const getGroup = (HRID, history = null) => async dispatch => {
  try {
    // If history is passed in, this is being called from outside of the group component, so the user may not be logged in or have the group type in state
    if (!!history) {
      const res = await axios.get(`/api/group/${HRID}/grouptype`);

      history.push(`/k/${res.data.name.split(" ").join("_")}/group/${HRID}`);
      return;
    }

    dispatch({
      type: GROUP_LOADING
    });

    const res = await axios.get(`/api/group/${HRID}`);

    dispatch({
      type: SET_GROUP,
      payload: res.data.group
    });

    dispatch({
      type: SET_GROUPTYPE,
      payload: res.data.groupType
    });
  } catch (err) {
    if (!!history) {
      dispatch(setAlert("Group does not exist", "is-warning"));
    }

    dispatch({
      type: GROUP_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
        HRID
      }
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
    dispatch({
      type: GROUP_LOADING
    });

    const res = await axios.post(`/api/group/list`, body, config);

    dispatch({
      type: SET_GROUPS,
      payload: res.data.groups
    });
    dispatch({
      type: SET_GROUPTYPE,
      payload: res.data.groupType
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
        groupTypeName
      }
    });
  }
};

// Create a group
export const createGroup = (groupFields, history) => async dispatch => {
  const formData = new FormData();

  for (const key of Object.keys(groupFields)) {
    formData.append(key, groupFields[key]);
  }

  try {
    dispatch({
      type: GROUP_LOADING
    });

    const res = await axios.post("/api/group", formData);

    dispatch(clearErrorsAndAlerts());
    dispatch(
      setAlert(`Group, ${groupFields.name}, created successfully`, "is-success")
    );
    dispatch({
      type: SET_GROUP,
      payload: res.data.group
    });

    history.push(
      `/k/${res.data.groupType.name.split(" ").join("_")}/group/${
        res.data.group.HRID
      }`
    );
  } catch (err) {
    dispatch(handleResponseErrors(err));
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete group
export const deleteGroup = (withoutConfirmation = false) => async dispatch => {
  if (
    withoutConfirmation ||
    window.confirm("Are you sure you would like to delete this group?")
  ) {
    try {
      dispatch({
        type: GROUP_LOADING
      });

      await axios.delete("/api/group");

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
