import { SET_BOOKMARKS, ADD_BOOKMARK, REMOVE_BOOKMARK } from '../actions-types';

const init = {
  bookmarks: [],
};

export default function (state = init, action) {
  switch (action.type) {
    case SET_BOOKMARKS:
      return {
        ...state,
        ...action.payload,
      };
    case ADD_BOOKMARK:
      const bookmarks = [...state.bookmarks, action.payload];
      return {
        ...state,
        bookmarks,
      };
    case REMOVE_BOOKMARK:
      const filteredBookmarks = state.bookmarks.filter((bookmark) => {
        return bookmark['LineNr'] !== action.payload;
      });
      return {
        ...state,
        bookmarks: filteredBookmarks,
      };
    default:
      return state;
  }
}
