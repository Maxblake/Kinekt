import axios from "axios";

import { handleResponseErrors } from "./helpers/helpers";
import { clearErrorsAndAlerts } from "./auth";
import { setTextAlert } from "./alert";

import {
  GROUP_LOADING,
  GROUP_LOADED,
  SET_GROUP,
  SET_GROUPS,
  SET_GROUPTYPE,
  GROUP_ERROR,
  GROUP_DELETED
} from "./types";

// Get group by HRID (human readable id)
export const getGroup = (
  { HRID, userCurrentGroupHRID },
  history = null
) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ HRID, userCurrentGroupHRID });

  try {
    dispatch({
      type: GROUP_LOADING
    });

    const res = await axios.post(`/api/group/HRID`, body, config);

    dispatch({
      type: SET_GROUP,
      payload: res.data.group
    });

    dispatch({
      type: SET_GROUPTYPE,
      payload: res.data.groupType
    });
  } catch (err) {
    dispatch(handleResponseErrors(err));
    dispatch({
      type: GROUP_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
        HRID
      }
    });
    if (!!history) {
      history.goBack();
    }
  }
};

// Get a list of groups within a given group type
export const getGroups = (
  groupTypeName,
  queryParams = null
) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const bodyBuilder = { groupTypeName: groupTypeName.toLowerCase() }; //hehehe

  if (queryParams !== null) {
    bodyBuilder.sortBy = queryParams.sortBy;
    bodyBuilder.searchTerms = queryParams.searchTerms;
  }

  const body = JSON.stringify(bodyBuilder);

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
      setTextAlert(
        `Group, ${groupFields.name}, created successfully`,
        "is-success"
      )
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

export const editGroup = (groupFields, groupId) => async dispatch => {
  const formData = new FormData();

  for (const key of Object.keys(groupFields)) {
    formData.append(key, groupFields[key]);
  }

  try {
    dispatch({
      type: GROUP_LOADING
    });

    const res = await axios.put(`/api/group/${groupId}`, formData);

    dispatch({
      type: SET_GROUP,
      payload: res.data.group
    });

    dispatch(clearErrorsAndAlerts());
    dispatch(
      setTextAlert(
        `Group, ${res.data.group.name}, has been updated`,
        "is-success"
      )
    );
  } catch (err) {
    dispatch(handleResponseErrors(err));
    dispatch({
      type: GROUP_LOADED
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

      dispatch({ type: GROUP_DELETED });
      dispatch(setTextAlert(`Group deleted`, "is-warning"));
    } catch (err) {
      dispatch({
        type: GROUP_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
