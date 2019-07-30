import { GET_GROUP, GROUP_ERROR } from "../actions/types";

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
        ...state,
        error: payload,
        loading: false
      };
    }
    default:
      return state;
  }
}
