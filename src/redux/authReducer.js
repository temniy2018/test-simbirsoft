import { AUTHORIZATION } from "./types";

const initState = {
  authUser: null,
};

export const authReducer = (state = initState, action) => {
  switch (action.type) {
    case AUTHORIZATION:
      return { ...state, authUser: action.payload };
    default:
      return state;
  }
};
