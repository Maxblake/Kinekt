import axios from "axios";
import moment from "moment";

import { handleResponseErrors } from "./helpers/helpers";
import { clearErrorsAndAlerts } from "./auth";
import { setTextAlert } from "./alert";

import {
  GROUP_LOADING,
  GROUP_LOADED,
  GROUPTYPE_LOADING,
  SET_GROUP,
  SET_CURRENT_GROUP,
  SET_GROUPS,
  CONCAT_GROUPS,
  SET_GROUPTYPE,
  GROUP_ERROR,
  GROUP_DELETED,
  GET_GROUP_NOTICES
} from "./types";

// Get group by HRID (human readable id)
export const getGroup = (
  { HRID, userCurrentGroupHRID, joinKey },
  history = null
) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ HRID, userCurrentGroupHRID, joinKey });

  try {
    dispatch({
      type: GROUP_LOADING
    });

    const res = await axios.post(`/api/group/HRID`, body, config);

    dispatch({
      type: SET_GROUPTYPE,
      payload: res.data.groupType
    });
    dispatch({
      type: SET_GROUP,
      payload: res.data.group
    });
    dispatch(sendExpirationWarning(res.data.group));
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

const sendExpirationWarning = group => dispatch => {
  const currentTime = moment();
  const expirationTime = moment(group.creationTimestamp).add(24, "hours");

  const diff = expirationTime.diff(currentTime);
  const diffDuration = moment.duration(diff);

  if (diffDuration.hours() <= 1) {
    dispatch(
      setTextAlert(
        `Heads up! '${group.name}' expires on ${expirationTime.format(
          "ddd M/D @ h:mm A"
        )}`,
        "is-warning"
      )
    );
  }
};

// Get a list of groups within a given group type
export const getGroups = (
  groupTypeName,
  queryParams = null,
  seenGroups = []
) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  let bodyBuilder = { groupTypeName: groupTypeName.toLowerCase(), seenGroups }; //hehehe

  if (queryParams !== null) {
    bodyBuilder = { ...bodyBuilder, ...queryParams };
  }

  const body = JSON.stringify(bodyBuilder);

  try {
    if (seenGroups.length === 0) {
      dispatch({
        type: GROUPTYPE_LOADING
      });
    }
    dispatch({
      type: GROUP_LOADING
    });

    const res = await axios.post(`/api/group/list`, body, config);

    dispatch({
      type: seenGroups.length > 0 ? CONCAT_GROUPS : SET_GROUPS,
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
        `Group, '${groupFields.name}', created successfully`,
        "is-success"
      )
    );
    dispatch({
      type: SET_GROUP,
      payload: res.data.group
    });
    dispatch({
      type: SET_CURRENT_GROUP,
      payload: {
        name: res.data.group.name,
        HRID: res.data.group.HRID
      }
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
export const deleteGroup = groupId => async dispatch => {
  try {
    dispatch({
      type: GROUP_LOADING
    });

    await axios.delete("/api/group");
    dispatch({ type: GROUP_DELETED, payload: groupId });
    dispatch({
      type: SET_CURRENT_GROUP,
      payload: null
    });
    dispatch(setTextAlert(`Group deleted`, "is-warning"));
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add a notice
export const addNotice = (noticeFields, groupId) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify(noticeFields);

  try {
    const res = await axios.put(`/api/group/notice/${groupId}`, body, config);

    dispatch({
      type: GET_GROUP_NOTICES,
      payload: res.data
    });
  } catch (err) {
    dispatch(handleResponseErrors(err));
  }
};

// Delete a notice
export const deleteNotice = (noticeId, groupId) => async dispatch => {
  try {
    const res = await axios.delete(`/api/group/notice/${groupId}/${noticeId}`);

    dispatch({
      type: GET_GROUP_NOTICES,
      payload: res.data
    });
  } catch (err) {
    dispatch(handleResponseErrors(err));
  }
};

export const toggleLikeNotice = (noticeId, groupId) => async dispatch => {
  try {
    const res = await axios.put(
      `/api/group/notice/${groupId}/toggle-like/${noticeId}`
    );

    dispatch({
      type: GET_GROUP_NOTICES,
      payload: res.data
    });
  } catch (err) {
    dispatch(handleResponseErrors(err));
  }
};
