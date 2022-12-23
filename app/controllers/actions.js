import DatabaseService from '../services/database-service';
import FormatService from '../services/format-service';
import SettingService from '../services/setting-service';
import {
  ADD_BOOKMARK,
  ADD_HISTORY,
  REMOVE_BOOKMARK,
  REMOVE_HISTORY,
  SET_BOOKMARKS,
  SET_DATA,
  SET_HISTORY,
  SET_LOCALIZATION,
  SET_RESULTS,
  SET_SETTING,
} from './actions-types';

export const getLanguages = () => {
  return async (dispatch) => {
    try {
      const languages = await SettingService.getLanguages();
      dispatch({ type: SET_SETTING, payload: { languages } });
    } catch (error) {
      console.log({ error });
    }
  };
};

export const getParts = (language) => {
  return async (dispatch) => {
    try {
      const parts = await DatabaseService.getParts(language);
      // console.log({ parts });
      dispatch({ type: SET_DATA, payload: { parts } });
    } catch (error) {
      console.log({ error });
    }
  };
};

export const getCompareParts = (compareLanguage) => {
  return async (dispatch) => {
    try {
      const compareParts = await DatabaseService.getParts(compareLanguage);
      dispatch({ type: SET_DATA, payload: { compareParts } });
    } catch (error) {
      console.log({ error });
    }
  };
};

export const getPapers = (language) => {
  return async (dispatch) => {
    try {
      const response = await DatabaseService.getPapers(language);
      const papers = await FormatService.formatPapers(response);
      dispatch({ type: SET_DATA, payload: { papers } });
    } catch (error) {}
  };
};

export const getComparePapers = (compareLanguage) => {
  return async (dispatch) => {
    try {
      const response = await DatabaseService.getPapers(compareLanguage);
      const comparePapers = await FormatService.formatPapers(response);
      dispatch({ type: SET_DATA, payload: { comparePapers } });
    } catch (error) {}
  };
};

export const getSections = (language) => {
  return async (dispatch) => {
    try {
      const response = await DatabaseService.getSections(language);
      const sections = await FormatService.formatSections(response);
      dispatch({ type: SET_DATA, payload: { sections } });
    } catch (error) {}
  };
};

export const getCompareSections = (compareLanguage) => {
  return async (dispatch) => {
    try {
      const response = await DatabaseService.getSections(compareLanguage);
      const compareSections = await FormatService.formatSections(response);
      dispatch({ type: SET_DATA, payload: { compareSections } });
    } catch (error) {}
  };
};

export const getContents = (language) => {
  return async (dispatch) => {
    try {
      const contentLineNumbers = {};
      const response = await DatabaseService.getContents(language);
      const contents = await FormatService.formatContents(response);
      for (const [index, content] of contents.entries()) {
        const LineNumber = content[0]['LineNr'];
        contentLineNumbers[LineNumber] = index;
      }
      dispatch({ type: SET_DATA, payload: { contents, contentLineNumbers } });
    } catch (error) {}
  };
};

export const getCompareContents = (compareLanguage) => {
  return async (dispatch) => {
    try {
      const response = await DatabaseService.getContents(compareLanguage);
      const compareContents = await FormatService.formatContents(response);
      dispatch({ type: SET_DATA, payload: { compareContents } });
    } catch (error) {}
  };
};

export const resetCompareContents = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_DATA,
        payload: {
          compareParts: [],
          comparePapers: [],
          compareSections: [],
          compareContents: [],
        },
      });
    } catch (error) {}
  };
};

export const getLanguage = () => {
  return async (dispatch) => {
    try {
      const language = await SettingService.getLanguage();
      dispatch({ type: SET_SETTING, payload: { language } });
    } catch (error) {}
  };
};

export const getCompareLanguage = () => {
  return async (dispatch) => {
    try {
      const compareLanguage = await SettingService.getLanguage();
      dispatch({ type: SET_SETTING, payload: { compareLanguage } });
    } catch (error) {}
  };
};

export const getSettings = () => {
  return async (dispatch) => {
    try {
      const responses = await SettingService.getSettings();
      const fontSize = responses[0]['FontSize'];
      const sepia = responses[0]['Sepia'];
      const margin = responses[0]['Margin'];
      const referenceNumber = responses[0]['ReferenceNumber'] === 1;
      const nightMode = responses[0]['NightMode'] === 1;
      const moreSpace = responses[0]['MoreSpace'] === 1;
      dispatch({
        type: SET_SETTING,
        payload: {
          fontSize,
          sepia,
          margin,
          referenceNumber,
          nightMode,
          moreSpace,
        },
      });
    } catch (error) {}
  };
};

export const setFontSize = (fontSize) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_SETTING,
        payload: { fontSize },
      });
      await SettingService.setFontSize(fontSize);
    } catch (error) {}
  };
};

export const setNightMode = (nightMode) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_SETTING,
        payload: { nightMode },
      });
      await SettingService.setNightMode(nightMode ? 1 : 0);
    } catch (error) {
      console.log({ error });
    }
  };
};

export const setReferenceNumber = (referenceNumber) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_SETTING,
        payload: { referenceNumber },
      });
      await SettingService.setReferenceNumber(referenceNumber ? 1 : 0);
    } catch (error) {}
  };
};

export const setMoreSpace = (moreSpace) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_SETTING,
        payload: { moreSpace },
      });
      await SettingService.setMoreSpace(moreSpace ? 1 : 0);
    } catch (error) {}
  };
};

export const setLanguage = (language, saveSetting = true) => {
  return async (dispatch) => {
    try {
      // console.log("\nSETTING LANGUAGE actions.js 228:"+language+" \n\n");
      dispatch({ type: SET_SETTING, payload: { language } });
      if (saveSetting) {
        await SettingService.setLanguage(language);
      }
    } catch (error) {
      // console.log("\nERROR IN SETTING LANGUAGE actions.js 233\n\n");
    } finally {
      // let langa = await SettingService.getLanguage();
      // console.log("Result of Setting Service: " + JSON.stringify(langa))
    }
  };
};

export const setCompareLanguage = (compareLanguage, saveSetting = true) => {
  return async (dispatch) => {
    try {
      dispatch({ type: SET_SETTING, payload: { compareLanguage } });
      if (saveSetting) {
        await SettingService.setCompareLanguage(compareLanguage);
      }
    } catch (error) {}
  };
};

export const getBookmarks = () => {
  return async (dispatch) => {
    try {
      const bookmarks = await SettingService.getBookmarks();
      dispatch({ type: SET_BOOKMARKS, payload: { bookmarks } });
    } catch (error) {}
  };
};

export const addBookmark = (bookmark) => {
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_BOOKMARK, payload: bookmark });
      await SettingService.addBookmark(bookmark);
    } catch (error) {}
  };
};

export const removeBookmark = (props) => {
  return async (dispatch) => {
    try {
      dispatch({ type: REMOVE_BOOKMARK, payload: props });
      await SettingService.removeBookmark(props);
    } catch (error) {
      console.log(error);
    }
  };
};

export const clearBookmarks = (props) => {
  return async (dispatch) => {
    try {
      await SettingService.clearBookmarks();
      dispatch({
        type: SET_BOOKMARKS,
        payload: {
          bookmarks: [],
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getHistories = () => {
  return async (dispatch) => {
    try {
      const histories = await SettingService.getHistories();
      dispatch({ type: SET_HISTORY, payload: { histories } });
    } catch (error) {}
  };
};

export const addHistory = (history) => {
  return async (dispatch) => {
    try {
      await SettingService.addHistoy(history);
      const histories = await SettingService.getHistories();
      dispatch({ type: SET_HISTORY, payload: { histories } });
    } catch (error) {
      console.log({ error });
    }
  };
};

export const removeHistory = (historyId) => {
  return async (dispatch) => {
    try {
      await SettingService.removeHistory(historyId);
      dispatch({ type: REMOVE_HISTORY, payload: { historyId } });
    } catch (error) {}
  };
};

export const clearHistory = () => {
  return async (dispatch) => {
    try {
      await SettingService.clearHistory();
      dispatch({ type: SET_HISTORY, payload: { histories: [] } });
    } catch (error) {}
  };
};

export const setLocalization = (params) => {
  return async (dispatch) => {
    try {
      let localizations = await SettingService.getLocalization(params);
      if (localizations) {
        if (localizations.length === 0) {
          const defaultPrefix = {
            prefix: 'eng',
          };
          localizations = await SettingService.getLocalization(defaultPrefix);
        }
      }
      let localization = localizations.length > 0 ? localizations[0] : {};
      localization = Object.keys(localization)
        .map((key) => {
          return {
            [key]: localization[key] ? localization[key] : '',
          };
        })
        .reduce((acc, cur) => {
          return { ...acc, ...cur };
        }, {});
      dispatch({ type: SET_LOCALIZATION, payload: { ...localization } });
    } catch (error) {
    } finally {
      let langa = await SettingService.getLocalization(params);
    }
  };
};

export const searchContents = (language, searchText) => {
  return async (dispatch) => {
    try {
      let results = await DatabaseService.searchContents(language, searchText);
      await SettingService.addSearchHistory({ searchText });
      const searchHistories = await SettingService.getSearchHistories();
      results = results.map((result) => {
        const attr = `[^.!?]*(${searchText})+[^.!?]*[.!?:]+`;
        const regex = new RegExp(attr, 'gi');
        const matchedContent = result.content.match(regex);
        const replaceRegex = new RegExp(searchText, 'gi');
        // console.log({ matchedContent });
        return {
          ...result,
          content:
            matchedContent && matchedContent.length > 0
              ? matchedContent[0].replace(
                  replaceRegex,
                  `<span>${searchText}</span>`,
                )
              : // .map((content) => content.replace(/<\/[A-Za-z]*>/g, '').replace(/[A-Za-z].*>/g, ''))
                // .join(' ')
                result.content.replace(
                  replaceRegex,
                  `<span>${searchText}</span>`,
                ),
        };
      });
      // console.log({ results });
      dispatch({ type: SET_RESULTS, payload: { results, searchHistories } });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getSearchHistories = () => {
  return async (dispatch) => {
    try {
      const searchHistories = await SettingService.getSearchHistories();
      if (searchHistories) {
        dispatch({ type: SET_RESULTS, payload: { searchHistories } });
      }
    } catch (error) {}
  };
};

export const clearSearchHistories = () => {
  return async (dispatch) => {
    try {
      await SettingService.clearSearchHistories();
      dispatch({ type: SET_RESULTS, payload: { searchHistories: [] } });
    } catch (error) {}
  };
};
