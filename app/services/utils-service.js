import FileService from "./file-service";
import SettingService from "./setting-service";

export default function UpgradeLocalization() {
   return new Promise(async (resolve, reject) => {
    try {
        const localVersionRawData = await SettingService.getLocalizationsVersion();
        const localVersion =  localVersionRawData[0]["LocalizationVersion"]
        const remoteVersionRawData = await FileService.getLocalizationsVersion();
        const remoteVersion = remoteVersionRawData["version"];
        if (remoteVersion && remoteVersion.length > 0) {
            if (localVersion !== remoteVersion) {
                await SettingService.updateLocalizationsVersion(remoteVersion);
                await SettingService.resetLocalizationTable();
                const remoteData = await FileService.getLocalizations();
                for (let i = 0; i < remoteData.length; i++) {
                    const keys = Object.keys(remoteData[i]).filter(key => key !== 'id');
                    const values = keys.map(key => `"${remoteData[i][key]}"`);
                    const query = `INSERT INTO Localizations (${keys}) VALUES (${values});`;
                    await SettingService.executeQuery(query);
                }
            }
        }
        resolve();
    } catch (error) {
        console.log({error})
        reject();
    }
   })
}

export function normalizeUnicode(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}