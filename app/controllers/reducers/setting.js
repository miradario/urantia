import {
    SET_SETTING,
  } from '../actions-types';
  
  const init = {
    languages: [],
    language: '',
    compareLanguage: '',
    fontSize: 14,
    nightMode: false,
    moreSpace: false,
    referenceNumber: false,
    sepia: 0,
    margin: 0,
  };
  
  export default function (state = init, action) {
    switch (action.type) {
      case SET_SETTING:
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  }
  