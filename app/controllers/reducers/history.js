import { SET_HISTORY, ADD_HISTORY, REMOVE_HISTORY } from '../actions-types';

const init = {
  histories: [],
};

export default function (state = init, action) {
  switch (action.type) {
    case SET_HISTORY:
      return {
        ...state,
        ...action.payload,
      };
    case ADD_HISTORY:
      const histories = [action.payload, ...state.histories];
      return {
        ...state,
        histories,
      };
    case REMOVE_HISTORY:
      return {
        ...state,
        histories: state.histories.filter((history) => {
          return history.id !== action.payload;
        }),
      };
    default:
      return state;
  }
}
