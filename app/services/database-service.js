import SQLite from 'react-native-sqlite-storage-api30';
import FormatService from './format-service';
SQLite.enablePromise(true);
export default class DatabaseService {
    static initDB(name) {
        return SQLite.openDatabase(
            { name, createFromLocation: `~${name}` },
            (success) => {
                console.log({ success });
            },
        );
    }

    static executeQuery(query, dbPrefix) {
        return new Promise(async (resolve, reject) => {
            try {
                const dbName = `${dbPrefix.toLowerCase()}-urantia.db`;
                const db = await this.initDB(dbName);
                const results = await db.executeSql(query);
                const { length, item } = results[0].rows;
                const data = await FormatService.formatDBResults(length, item);
                resolve(data);
                db.close();
            } catch (error) {
                console.log({ error });
                reject(error);
            }
        });
    }

    static getLanguages() {
        const getLanguagesQuery = `SELECT * FROM Languages`;
        return this.executeQuery(getLanguagesQuery, 'lang');
    }

    static getAuthors(language) {
        const getAuthorsQuery = `SELECT * FROM ${language}Authors`;
        return this.executeQuery(getAuthorsQuery, language);
    }

    static getParts(language) {
        const getPartsQuery = `SELECT Prefix, Title, PartNr FROM ${language}Parts`;
        return this.executeQuery(getPartsQuery, language);
    }

    static getPapers(language) {
        const getPapersQuery = `SELECT
        txt.PaperNr AS PaperNr
      , pap.PartNr AS PartNr
      , txt.Content AS Content
    FROM ${language}Texts txt
    LEFT JOIN ${language}Papers pap
    ON txt.PaperNr = pap.PaperNr
    WHERE txt.TextTypeId = 0
    AND txt.PaperSec = 0
    AND txt.PaperNr != 0
    ORDER BY PaperNr`;
        return this.executeQuery(getPapersQuery, language);
    }

    static getSections(language) {
        // const getSectionsQuery = `SELECT LineNr, PaperNr, PaperSec, PageNr, Content FROM ${language}Texts WHERE TextTypeId IN (0,1) ORDER BY PaperSec`;
        const getSectionsQuery = `SELECT txt.PaperNr AS PaperNr
      , txt.LineNr AS LineNr
      , txt.PaperSec AS PaperSec
      , txt.PageNr AS PageNr
      , txt.Content AS Content
      , pap.PartNr AS PartNr
      FROM ${language}Texts txt
      LEFT JOIN ${language}Papers pap
      ON txt.PaperNr = pap.PaperNr
      WHERE txt.TextTypeId IN (0,1)
      ORDER BY txt.PaperSec`;
        return this.executeQuery(getSectionsQuery, language);
    }

    static getContents(language) {
        const getContentsQuery = `SELECT * FROM ${language}Texts ORDER BY LineNr`;
        return this.executeQuery(getContentsQuery, language);
    }

    static searchContents(language, searchText) {
        const tableVariant = language.toLowerCase() === 'eng' ? '5' : '';
        const getSearchContentsQuery = `
SELECT 	m.LineNR
, 		highlight(TextsFTS${tableVariant}, 1, '<span>', '</span>') AS content
,  	    et.PageNr 		AS pageNr
,   	et.PaperNr 		AS paperNr
,       et.PaperSec 	AS paperSec
,       et.PaperPar 	AS paperPar
,		pn.Content AS paper
,		e3.LineNr AS lineNr

FROM TextsFTS${tableVariant} m

JOIN ${language}Texts et
    ON et.LineNR = m.LineNR

-- Get the Name of the Paper this verse is from
LEFT JOIN ${language}Texts pn
    ON  pn.PaperNr = et.PaperNr
    AND pn.TextTypeId = 0

-- do something
LEFT JOIN ${language}Texts e3
    ON e3.PaperSec = et.PaperSec
    AND e3.PaperNr = et.PaperNr
    AND e3.TextTypeId IN (0,1)

WHERE m.Content MATCH '${searchText}'`
        return this.executeQuery(getSearchContentsQuery, language);
    }
}
