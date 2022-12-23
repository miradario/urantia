import { SET_HISTORY, ADD_HISTORY, SET_LOCALIZATION } from '../actions-types';

export default function (state = {}, action) {
  switch (action.type) {
    case SET_LOCALIZATION:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
