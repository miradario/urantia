import RNFetchBlob from 'rn-fetch-blob';
import Message from '../components/shared/message';
import NetInfo from '@react-native-community/netinfo';
export default class FileService {
  static download(downloadUrl) {
    return new Promise(async (resolve, reject) => {
      try {
        const isConnected = await this.getConnectionStatus();
        if (isConnected) {
          const path = `${RNFetchBlob.fs.dirs['MainBundleDir']}/databases`;
          let fileName;
          const urlMatches = downloadUrl.match(/([^/])+$/g);
          if (urlMatches && urlMatches.length > 0) {
            fileName = urlMatches[0];
          }
          const filePath = `${path}/${fileName}`;
          await this.validateFilePath(filePath);
          RNFetchBlob.config({
            // add this option that makes response data to be stored as a file,
            // this is much more performant.
            path: filePath,
            fileCache: true,
            appendExt: 'db',
          })
            .fetch('GET', downloadUrl, {
              //some headers ..
            })
            .then((res) => {
              const status = res.respInfo.status;
              if (status === 404 || status === 403) {
                const error =
                  status === 403
                    ? 'Forbidden access is denied.'
                    : 'File not found.';
                reject(error);
              }
              RNFetchBlob.fs
                .ls(`${RNFetchBlob.fs.dirs['MainBundleDir']}/databases`)
                .then((result) => {
                  console.log({ result });
                  resolve(path);
                });
              resolve(path);
            })
            .catch((error) => {
              console.log({ error });
              reject(error);
            });
        } else {
          // Message({
          //   title:
          //     'No Internet connection. Make sure that Wi-Fi or mobile data is turned on.',
          //   subtitle: 'Then, try again',
          // });
          reject(
            'This application requires an internet connect on first use and/or to download new book languages.',
          );
        }
      } catch (error) {
        Message({
          title: 'Error occured while downloading the data.',
          subtitle: error,
        });
        reject(error);
      }
    });
  }

  static FetchData(url) {
    return new Promise((resolve, reject) => {
      fetch(url, { cache: 'no-cache' })
        .then((response) => {
          resolve(response.json());
        })
        .catch((error) => {
          resolve([]);
        });
    });
  }

  static validateFilePath(filePath) {
    return new Promise((resolve, reject) => {
      RNFetchBlob.fs
        .exists(filePath)
        .then((exist) => {
          if (exist) {
            RNFetchBlob.fs
              .unlink(filePath)
              .then(() => resolve())
              .catch((error) => {
                console.log({ error });
                reject(error);
              });
          } else {
            resolve();
          }
        })
        .catch(() => reject());
    });
  }

  static getLanguages() {
    const url = 'https://urantia.s3.amazonaws.com/app/prod/db/languages.json';
    return this.FetchData(url);
  }

  static getLocalizations() {
    const url = 'https://urantia.s3.amazonaws.com/app/prod/db/localizations-db.json';
    return this.FetchData(url);
  }

  static getLocalizationsVersion() {
    const url = 'https://urantia.s3.amazonaws.com/app/prod/db/localizations-version.json';
    return this.FetchData(url);
  }

  static exist(filePath) {
    return new Promise((resolve, reject) => {
      RNFetchBlob.fs
        .exists(filePath)
        .then((exist) => {
          if (exist) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  static reset() {
    const filePath = `${RNFetchBlob.fs.dirs['MainBundleDir']}/databases`;
    RNFetchBlob.fs.ls(filePath).then(async (results) => {
      await Promise.all(
        results.map((result) => {
          return new Promise((resolve, reject) => {
            const indivitualFilePath = `${filePath}/${result}`;
            // console.log({ indivitualFilePath });
            RNFetchBlob.fs
              .unlink(indivitualFilePath)
              .then(() => resolve())
              .catch((error) => {
                reject(error);
              });
          });
        }),
      );
    });
  }

  static getConnectionStatus() {
    return new Promise((resolve, reject) => {
      NetInfo.fetch()
        .then((state) => {
          // console.log({ state });
          resolve(state.isConnected);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  static delete(filePath) {
    return new Promise((resolve, reject) => {
      RNFetchBlob.fs
        .unlink(filePath)
        .then(() => resolve())
        .catch((err) => {
          console.log({ err });
          reject(err);
        });
    });
  }

  static list(path) {
    return new Promise((resolve, reject) => {
      RNFetchBlob.fs
        .ls(path)
        // files will an array contains filenames
        .then((files) => {
          resolve(files);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
