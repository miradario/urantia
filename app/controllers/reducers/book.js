import { SET_DATA } from '../actions-types';

const init = {
  parts: [],
  papers: [],
  sections: [],
  contents: [],
  contentLineNumbers: {},
  compareParts: [],
  comparePapers: [],
  compareSections: [],
  compareContents: [],
};

export default function (state = init, action) {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
