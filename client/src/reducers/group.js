import { GET_GROUP, GROUP_ERROR, CLEAR_GROUP } from "../actions/types";

const initialState = {
  group: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_GROUP: {
      return {
        ...state,
        group: payload,
        loading: false
      };
    }
    case GROUP_ERROR: {
      return {
        group: null,
        error: payload,
        loading: false
      };
    }
    case CLEAR_GROUP: {
      return {
        group: null,
        error: {},
        loading: false
      };
    }
    default:
      return state;
  }
}
