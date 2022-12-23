import { SET_RESULTS } from '../actions-types';

const init = {
  results: [],
  searchHistories: [],
};

export default function (state = init, action) {
  switch (action.type) {
    case SET_RESULTS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
