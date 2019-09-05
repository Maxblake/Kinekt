import { SET_GROUP_AND_USER_NUMBERS } from "../actions/types";

const initialState = {
  groupNumbersMap: {},
  groupTypeNumbersMap: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_GROUP_AND_USER_NUMBERS: {
      return {
        ...state,
        groupNumbersMap: payload.groupNumbersMap
          ? payload.groupNumbersMap
          : state.groupNumbersMap,
        groupTypeNumbersMap: payload.groupTypeNumbersMap
          ? payload.groupTypeNumbersMap
          : state.groupTypeNumbersMap
      };
    }
    default:
      return state;
  }
}
