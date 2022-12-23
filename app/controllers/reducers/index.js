import { combineReducers } from 'redux';
import book from './book';
import setting from './setting';
import bookmark from './bookmark';
import history from './history';
import localization from './localization';
import search from './search'
export default combineReducers({
  book,
  setting,
  bookmark,
  history,
  localization,
  search
});
