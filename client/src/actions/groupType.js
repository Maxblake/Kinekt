import axios from "axios";

import { GET_GROUPTYPES, GROUPTYPE_ERROR, CLEAR_GROUPTYPES } from "./types";

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
