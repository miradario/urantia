import React, { Component, version } from 'react';
import { ListItem, Button, colors, Card, Icon } from 'react-native-elements';
import UText from '../shared/u-text';
import FileService from '../../services/file-service';
import {
  DARK_GREY,
  DODGER_BLUE,
  DRACULA_ORCHID,
  RED_PIGMENT,
  SHAMROCK,
  WHISPER,
  WHITE,
  COPY_GREY,
} from '../color';
import SettingService from '../../services/setting-service';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getLanguages } from '../../controllers/actions';
import { View } from 'react-native';
import styles from '../styles';
import CONFIG from '../../../config.json';
import { ActivityIndicator, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import { COMP_TYPES } from '../../routers/types';
import RNFetchBlob from 'rn-fetch-blob';
import RNRestart from 'react-native-restart';
import { DEFAULT_FONT } from '../constants';

const ENV = CONFIG['ENV'];
class LanguageManage extends Component {
  state = {
    languages: [],
    showModal: false,
    showProgress: false,
    updateAvailable: false,
    updatableLanguages: [],
  };

  componentDidMount() {
    this.setNightMode();
    this.getLanguages();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nightMode !== this.props.nightMode) {
      this.setNightMode();
    }
    if (prevProps.languages.length !== this.props.languages.length) {
      this.getLanguages();
    }
  }

  getLanguages = async () => {
    try {
      // await SettingService.removeLanguages();
      const _downloadedLanguages = await SettingService.getLanguages();
      const langs = await FileService.getLanguages();
      const versions = langs.reduce(
        (object, lang) => ({ ...object, [lang.Prefix]: lang.Version }),
        {},
      );
      let updateAvailable = false;
      const updatableLanguages = [];
      const downloadedLanguages = {};
      console.log({ _downloadedLanguages });
      _downloadedLanguages.forEach((lang) => {
        downloadedLanguages[lang.Prefix] = true;
        if (versions[lang.Prefix] && lang.Version !== versions[lang.Prefix]) {
          lang['UpdatedVersion'] = versions[lang.Prefix];
          updatableLanguages.push(lang);
          if (!updateAvailable) {
            updateAvailable = true;
          }
        }
      });
      // console.log({downloadedLanguages})
      let languages = await FileService.getLanguages();
      if (languages && languages.length === 0) {
        languages = _downloadedLanguages
      }
      this.setState({
        updateAvailable,
        updatableLanguages,
        languages: languages
          .map((lang) => ({
            ...lang,
            downloaded: downloadedLanguages[lang.Prefix],
            disabled:
              this.props.language.toLowerCase() === lang.Prefix ||
              this.props.compareLanguage.toLowerCase() === lang.Prefix,
            downloading: false,
          }))
          .sort((prev, next) => prev.NativeName > next.NativeName),
      });
      // console.log("Languages List", this.state.languages);
    } catch (error) {
      this.setState({
        showMessage: true,
      });
      console.log({ error });
    }
  };

  updateLanguages = async () => {
    try {
      this.setState({
        showModal: true,
        showProgress: true,
      });
      await Promise.all(
        this.state.updatableLanguages.map((lang) => {
          return new Promise(async (resolve, reject) => {
            try {
              const { Prefix, UpdatedVersion } = lang;
              const dbName = Prefix + '-urantia.db';
              const dbJournalName = Prefix + '-urantia.db-journal';
              const downloadUrl = CONFIG['BASE_URL'][ENV] + dbName;
              const path = `${RNFetchBlob.fs.dirs['MainBundleDir']}/databases/`;

              const dbFilePath = path + dbName;
              const journalFilePath = path + dbJournalName;
              const dbFileExist = await FileService.exist(dbFilePath);
              if (dbFileExist) {
                await FileService.delete(dbFilePath);
                const journalFileExist = await FileService.exist(
                  journalFilePath,
                );
                if (journalFileExist) {
                  await FileService.delete(journalFilePath);
                }
                await FileService.download(downloadUrl);
                await SettingService.updateVersion(Prefix, UpdatedVersion);
              }
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        }),
      );

      this.setState({
        showProgress: false,
      });
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 3000);
      });
      RNRestart.Restart();
    } catch (error) {
    } finally {
      this.setState({
        showModal: false,
        showProgress: false,
      });
    }
  };

  setNightMode() {
    const nightMode = this.props.nightMode;
    this.props.navigation.setOptions({
      headerStyle: {
        backgroundColor: nightMode ? DARK_GREY : WHITE,
      },
      headerTitleStyle: {
        ...styles.headerTitle,
        color: nightMode ? WHITE : DARK_GREY,
      },
    });
  }

  deleteDownloadedLanguage = async (langPrefix) => {
    try {
      this.setState({
        showModal: true,
        showProgress: true,
      });
      const dbName = langPrefix + '-urantia.db';
      const dbJournalName = langPrefix + '-urantia.db-journal';
      const path = `${RNFetchBlob.fs.dirs['MainBundleDir']}/databases/`;
      const dbFilePath = path + dbName;
      const journalFilePath = path + dbJournalName;
      const dbFileExist = await FileService.exist(dbFilePath);
      const journalFileExist = await FileService.exist(journalFilePath);
      if (dbFileExist) {
        await FileService.delete(dbFilePath);
      }
      if (journalFileExist) {
        await FileService.delete(journalFilePath);
      }
      await SettingService.deleteLanguage(langPrefix);
      this.props.getLanguages();
    } catch (error) {
      console.log({ error });
    } finally {
      setTimeout(() => {
        this.getLanguages();
        this.setState({
          showModal: false,
          showProgress: false,
        });
      }, 2000);
    }
  };

  downloadLanguage = async (language, index) => {
    try {
      this.state.languages[index]['downloading'] = true;
      this.setState({
        languages: this.state.languages,
      });
      const fileName = language.Prefix + '-urantia.db';
      const downloadUrl = CONFIG['BASE_URL'][ENV] + fileName;
      await FileService.download(downloadUrl);
      await SettingService.addLanguage(language);
      this.state.languages[index]['downloaded'] = true;
      this.setState({
        languages: this.state.languages,
      });
      this.props.getLanguages();
    } catch (error) {
      console.log({ error });
    } finally {
      this.state.languages[index]['downloading'] = false;
      this.setState({
        languages: this.state.languages,
      });
    }
  };

  render() {
    const {
      updateAll,
      restartMsg,
      updateMsg,
      deleteLanguage,
      download,
      yes,
      no,
      deleteMsg,
      availableLanguages,
      updateNow,
      updateNowMsg,
      downloading,
    } = this.props.localization;
    const backgroundColor = this.props.nightMode ? DARK_GREY : WHISPER;
    const color = this.props.nightMode ? WHISPER : DARK_GREY;
    const copyc = this.props.nightMode ? COPY_GREY: COPY_GREY;
    const { fontSize } = this.props;
    const titleStyle = {
      fontSize,
      fontFamily: DEFAULT_FONT,
    };
    const buttonStyle = {
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: RED_PIGMENT,
    };
    const containerStyle = {
      alignSelf: 'center',
      marginTop: 10,
      backgroundColor: SHAMROCK,
    };
    return (
      <>
        {this.state.updateAvailable && (
          <>
            <Card
              containerStyle={{
                justifyContent: 'center',
                marginBottom: 10,
                backgroundColor,
              }}>
              <UText
                style={{
                  fontSize: fontSize + 2,
                  color,
                  textAlign: 'center',
                  marginBottom: 10,
                }}>
                {updateNowMsg}
              </UText>
              <Button
                title={updateNow}
                titleStyle={{
                  fontSize: fontSize + 2,
                  fontFamily: DEFAULT_FONT,
                }}
                buttonStyle={{
                  paddingHorizontal: 15,
                  // paddingVertical: 5,
                  backgroundColor: SHAMROCK,
                }}
                containerStyle={{
                  alignSelf: 'center',
                  marginTop: 10,
                  backgroundColor: SHAMROCK,
                }}
                onPress={() => {
                  this.updateLanguages();
                }}
              />
            </Card>
          </>
        )}
        <ScrollView style={{ flex: 1, backgroundColor }}>
          <Card
            containerStyle={{
              justifyContent: 'center',
              marginBottom: 10,
              backgroundColor,
            }}>
            <ListItem
              key="update-all"
              containerStyle={{
                backgroundColor,
              }}>
              <ListItem.Content>
                <UText style={{ color }}> {availableLanguages}</UText>
              </ListItem.Content>
            </ListItem>
            {this.state.languages.map((language, index) => {
              return (
                <ListItem
                  key={index}
                  containerStyle={{
                    backgroundColor,
                  }}>
                  <ListItem.Content>
                    <UText style={{ color }}>{language.NativeName}</UText>
                    <UText style={{ color: copyc, fontSize: fontSize - 2 }}>{language.Copyright}</UText>
                  </ListItem.Content>
                  {language.downloaded ? (
                    <Button
                      title={deleteLanguage}
                      titleStyle={titleStyle}
                      buttonStyle={buttonStyle}
                      disabled={language.disabled}
                      containerStyle={containerStyle}
                      onPress={() => {
                        Alert.alert('', deleteMsg, [
                          {
                            text: no,
                            onPress: () => console.log('Cancel Pressed'),
                          },
                          {
                            text: yes,
                            onPress: () =>
                              this.deleteDownloadedLanguage(language.Prefix),
                          },
                        ]);
                      }}
                    />
                  ) : (
                    <Button
                      title={language.downloading ? downloading : download}
                      disabled={language.downloading}
                      titleStyle={titleStyle}
                      buttonStyle={{
                        ...buttonStyle,
                        backgroundColor: DODGER_BLUE,
                      }}
                      containerStyle={containerStyle}
                      onPress={() => {
                        this.downloadLanguage(language, index);
                      }}
                    />
                  )}
                </ListItem>
              );
            })}
          </Card>
        </ScrollView>
        <Modal
          // animationType="slide"
          transparent={true}
          visible={this.state.showModal}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.9,
              backgroundColor,
            }}>
            {this.state.showProgress ? (
              <ActivityIndicator size="small" color={DRACULA_ORCHID} />
            ) : (
              <View>
                <UText style={{ textAlign: 'center' }}>{updateMsg}</UText>
                <UText style={{ textAlign: 'center' }}>{restartMsg}</UText>
              </View>
            )}
          </View>
        </Modal>
      </>
    );
  }
}

function mapStateToProps(state) {
  const {
    languages,
    nightMode,
    language,
    compareLanguage,
    fontSize,
  } = state.setting;
  const { localization } = state;
  return {
    language,
    compareLanguage,
    languages,
    localization,
    nightMode,
    fontSize,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLanguages,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(LanguageManage);
