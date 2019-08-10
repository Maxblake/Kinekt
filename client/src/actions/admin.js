import axios from "axios";

// Get all requested group types
export const getRequestedGroupTypes = () => async dispatch => {
  try {
    const res = await axios.get(`/api/admin/get-requested-group-types`);
    return res.data;
  } catch (err) {
    // set alert
  }
};
