import SQLite from 'react-native-sqlite-storage-api30';
import FormatService from './format-service';
export default class SettingService {
  static initDB() {
    return SQLite.openDatabase({
      name: 'user-info.db',
      createFromLocation: '~user-info.db',
    });
  }

  static executeQuery(query) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.initDB();
        const results = await db.executeSql(query);
        const { length, item } = results[0].rows;
        resolve(FormatService.formatDBResults(length, item));
      } catch (error) {
        reject(error);
      }
    });
  }

  static getLanguages() {
    const getLanguagesQuery = `SELECT * FROM Languages`;
    return this.executeQuery(getLanguagesQuery);
  }

  static addLanguage(language) {
    const { Prefix, NativeName, Version } = language;
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.executeQuery(
          `SELECT * FROM Languages WHERE Prefix = '${Prefix}'`,
        );
        if (response && response.length === 0) {
          const addLangaugeQuery = `INSERT INTO Languages
          (Prefix, NativeName, Version)
          VALUES
          ('${Prefix}', '${NativeName}', '${Version}')`;
          await this.executeQuery(addLangaugeQuery);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateVersion(prefix, updatedVersion) {
    const updateVersionQuery = `UPDATE Languages SET Version = '${updatedVersion}' WHERE Prefix = '${prefix}'`;
    return this.executeQuery(updateVersionQuery);
  }

  static deleteLanguage(Prefix) {
    const removeLanguagesQuery = `DELETE FROM Languages WHERE Prefix = '${Prefix}'`;
    return this.executeQuery(removeLanguagesQuery);
  }

  static removeLanguages() {
    const removeLanguagesQuery = `DELETE FROM Languages`;
    return this.executeQuery(removeLanguagesQuery);
  }

  static getDefaults() {
    const getDefaultLanguageQuery = `SELECT * FROM Settings`;
    return this.executeQuery(getDefaultLanguageQuery);
  }

  static getInitValues() {
    const getInitQuery = `SELECT * FROM Settings WHERE id = 1`;
    return this.executeQuery(getInitQuery);
  }

  static getLocalizations() {
    const getLocalizationQuery = `SELECT * FROM Localizations`;
    return this.executeQuery(getLocalizationQuery);
  }

  static getLocalizationsVersion() {
    const query = `SELECT LocalizationVersion FROM Settings WHERE id = 1`;
    return this.executeQuery(query);
  }

  static updateLocalizationsVersion(version) {
    const query = `UPDATE Settings SET LocalizationVersion = '${version}' WHERE id = 1`;
    return this.executeQuery(query);
  }

  static resetLocalizationTable() {
    const query = `DELETE FROM Localizations;DELETE FROM sqlite_sequence WHERE name='Localizations';`
    return this.executeQuery(query);
  }

  static getLocalization(params) {
    const { prefix, code2 } = params;
    const getLocalizationQuery = `SELECT * FROM Localizations WHERE prefix = '${prefix}' OR code2 = '${code2}'`;
    return this.executeQuery(getLocalizationQuery);
  }

  static addLocalization(keys, values) {
    const query =  `INSERT INTO Localizations (${keys}) VALUES (${values});`
    return this.executeQuery(query);
  }

  static getLanguage() {
    const getLanguageQuery = `SELECT * FROM Settings WHERE id = 1`;
    return this.executeQuery(getLanguageQuery);
  }

  static getCompareLanguage() {
    const getCompareLanguageQuery = `SELECT CompareLanguage FROM Settings WHERE id = 1`;
    return this.executeQuery(getCompareLanguageQuery);
  }

  static setFontSize(fontSize) {
    const setFontSizeQuery = `UPDATE Settings SET FontSize = ${fontSize} WHERE id = 1`;
    return this.executeQuery(setFontSizeQuery);
  }

  static setNightMode(nightMode) {
    const setNightModeQuery = `UPDATE Settings SET NightMode = ${nightMode} WHERE id = 1`;
    return this.executeQuery(setNightModeQuery);
  }

  static setMoreSpace(moreSpace) {
    const setMoreSpaceQuery = `UPDATE Settings SET MoreSpace = ${moreSpace} WHERE id = 1`;
    return this.executeQuery(setMoreSpaceQuery);
  }

  static setReferenceNumber(referenceNumber) {
    const setReferenceNumberQuery = `UPDATE Settings SET ReferenceNumber = ${referenceNumber} WHERE id = 1`;
    return this.executeQuery(setReferenceNumberQuery);
  }

  static setLanguage(language) {
    const setLanguageQuery = `UPDATE Settings SET Language = '${language}' WHERE id = 1`;
    return this.executeQuery(setLanguageQuery);
  }

  static setCompareLanguage(language) {
    const setCompareLanguageQuery = `UPDATE Settings SET CompareLanguage = '${language}' WHERE id = 1`;
    return this.executeQuery(setCompareLanguageQuery);
  }

  static getSettings() {
    const getSettingsQuery = `SELECT FontSize, NightMode, ReferenceNumber, MoreSpace, Margin, Sepia FROM Settings;`;
    return this.executeQuery(getSettingsQuery);
  }

  static getBookmarks() {
    const getBookmarksQuery = `SELECT * FROM Bookmarks`;
    return this.executeQuery(getBookmarksQuery);
  }

  static addBookmark(props) {
    const { PageNr, LineNr, PaperNr, PaperSec } = props;
    const addBookmarksQuery = `INSERT INTO Bookmarks (PageNr, LineNr, PaperNr, PaperSec) VALUES (${PageNr}, ${LineNr}, ${PaperNr}, ${PaperSec})`;
    return this.executeQuery(addBookmarksQuery);
  }

  static removeBookmark(LineNr) {
    const removeBookmarksQuery = `DELETE FROM Bookmarks WHERE LineNr = ${LineNr}`;
    return this.executeQuery(removeBookmarksQuery);
  }

  static clearBookmarks() {
    return this.executeQuery(`DELETE FROM Bookmarks`);
  }

  static getHistories() {
    const getHistoriesQuery = `SELECT * FROM Histories ORDER BY id DESC`;
    return this.executeQuery(getHistoriesQuery);
  }

  static addHistoy(props) {
    const { PageNr, LineNr, PaperNr, PaperSec } = props;
    return new Promise(async (resolve, reject) => {
      try {
        const existingQuery = `SELECT id
          FROM Histories
          WHERE PageNr = ${PageNr}
          AND LineNr = ${LineNr}
          AND PaperNr = ${PaperNr}
          AND PaperSec = ${PaperSec}`;
        const response = await this.executeQuery(existingQuery);
        if (response && response.length > 0) {
          const deleteQuery = `DELETE FROM Histories WHERE id IN (${response.map(
            (res) => res['id'],
          )})`;
          await this.executeQuery(deleteQuery);
        }
        const addHistoryQuery = `INSERT INTO Histories (PageNr, LineNr, PaperNr, PaperSec) VALUES (${PageNr}, ${LineNr}, ${PaperNr}, ${PaperSec})`;
        await this.executeQuery(addHistoryQuery);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  static removeHistory(historyId) {
    const removeHistoryQuery = `DELETE FROM Histories WHERE id = ${historyId}`;
    return this.executeQuery(removeHistoryQuery);
  }

  static clearHistory() {
    return this.executeQuery(`DELETE FROM Histories`);
  }

  static addSearchHistory({ searchText }) {
    const addSearchHistoryQuery = `INSERT INTO SearchHistories (searchText, createdAt) VALUES ('${searchText}', datetime('now','localtime'))`;
    return this.executeQuery(addSearchHistoryQuery);
  }

  static getSearchHistories() {
    const getQuery = `SELECT * FROM SearchHistories ORDER BY id DESC`;
    return this.executeQuery(getQuery);
  }

  static clearSearchHistories() {
    const deleteQuery = `DELETE FROM SearchHistories`;
    return this.executeQuery(deleteQuery);
  }
}
