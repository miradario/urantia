import React, { Component } from 'react';
import { View, Alert, Dimensions, Modal } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { ListItem, Button } from 'react-native-elements';
import UText from '../shared/u-text';
import FileService from '../../services/file-service';
import { DARK_GREY, DODGER_BLUE, SHAMROCK, WHITE } from '../color';
import SettingService from '../../services/setting-service';
import { Picker } from '@react-native-picker/picker';
import { COMP_TYPES } from '../../routers/types';
import styles from '../styles';
import { NativeModules } from 'react-native';
import CONFIG from '../../../config.json';
import { ScrollView } from 'react-native-gesture-handler';
import UpgradeLocalization from '../../services/utils-service';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLocalization } from '../../controllers/actions';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ENV = CONFIG['ENV'];

class LanguageSetup extends Component {
  state = {
    showPicker: false,
    languages: [],
    selectedLanguages: [],
    downloadedLanguages: [],
    defaultLanguage: '',
    selectPageVisibility: true,
    downloadPageVisibility: false,
    defaultPageVisibility: false,
    // localizations: {},
    langObject: {},
    showMessage: false,
    marginVertical: 60,
  };
  componentDidMount() {
    this.getLocalization();
    this.getLanguages();
  }

  getLocalization = async () => {
    try {
      await UpgradeLocalization();
      const { localeIdentifier } = NativeModules.I18nManager;
      console.log('Locale determined by TZ: ' + localeIdentifier);
      const code2 = localeIdentifier ? localeIdentifier.substring(0, 2) : 'en';
      this.props.setLocalization({ code2 });
    } catch (error) {
      console.log({ error });
    }
  };

  async getLanguages() {
    try {
      // await SettingService.removeLanguages();
      const languages = await FileService.getLanguages();
      this.setState({
        languages: languages
          .map((lang) => ({
            ...lang,
            selected: false,
            downloaded: false,
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
  }

  async downloadLanguages(languages) {
    try {
      await Promise.all(
        languages.map((language) => {
          return new Promise(async (resolve, reject) => {
            try {
              const fileName = language.Prefix + '-urantia.db';
              const downloadUrl = CONFIG['BASE_URL'][ENV] + fileName;
              await FileService.download(downloadUrl);
              await SettingService.addLanguage(language);
              this.setState({
                selectedLanguages: this.state.selectedLanguages.map(
                  (_language) => {
                    return {
                      ..._language,
                      downloaded:
                        _language.Prefix === language.Prefix
                          ? true
                          : _language.downloaded,
                    };
                  },
                ),
              });
            } catch (error) {
              console.log({ error });
              reject(error);
            }
          });
        }),
      );
    } catch (error) {
      console.log({ error });
    }
  }

  async setDefaultLanguage(defaultLanguage) {
    try {
      await SettingService.setLanguage(defaultLanguage);
      this.props.setLocalization({ prefix: defaultLanguage });
      this.setState({
        defaultLanguage,
        showPicker: false,
      });
    } catch (error) {
      console.log({ error });
    }
  }

  async getDownloadedLanguages() {
    try {
      const downloadedLanguages = await SettingService.getLanguages();
      downloadedLanguages.sort(
        (prev, next) => prev.NativeName > next.NativeName,
      );
      let param = {};
      const langObject = downloadedLanguages.reduce(
        (obj, item) => ((obj[item.Prefix] = item.NativeName), obj),
        {},
      );
      if (downloadedLanguages.length > 0) {
        const { Prefix: defaultLanguage } = downloadedLanguages[0];
        param = {
          defaultLanguage,
        };
        await SettingService.setLanguage(defaultLanguage);
        this.props.setLocalization({ prefix: defaultLanguage });
      }
      let marginVertical = 60;
      if (downloadedLanguages.length > 10) {
        marginVertical = 10;
      } else if (downloadedLanguages.length > 8) {
        marginVertical = 20;
      } else if (downloadedLanguages.length > 6) {
        marginVertical = 30;
      } else if (downloadedLanguages.length > 4) {
        marginVertical = 40;
      }
      this.setState({
        downloadedLanguages,
        downloadPageVisibility: false,
        defaultPageVisibility: true,
        langObject,
        marginVertical,
        ...param,
      });
    } catch (error) {
      console.log({ error });
    }
  }

  render() {
    // const { localizations } = this.state;
    const { localization } = this.props;
    return (
      <>
        {this.state.selectPageVisibility && (
          <View
            style={{
              margin: '10%',
              // height: "90%",
              flex: 1,
            }}>
            <ScrollView>
              <View
                style={{
                  borderRadius: 5,
                  padding: 5,
                  backgroundColor: '#FFF',
                }}>
                <ListItem key="languages">
                  <ListItem.Content>
                    <ListItem.Title>
                      <UText style={{ fontSize: 15 }}>
                        {localization.selectLanguage}
                      </UText>
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                {this.state.languages.map((language, index) => {
                  return (
                    <ListItem
                      key={index}
                      onPress={() => {
                        this.setState({
                          languages: this.state.languages.map((_language) => {
                            return {
                              ..._language,
                              selected:
                                _language.Prefix === language.Prefix
                                  ? !_language.selected
                                  : _language.selected,
                            };
                          }),
                        });
                      }}>
                      <ListItem.Content>
                        <ListItem.Title>
                          <UText style={{ fontSize: 14 }}>
                            {language.NativeName}
                          </UText>
                        </ListItem.Title>
                      </ListItem.Content>
                      <CheckBox
                        value={language.selected}
                        tintColors={{ true: SHAMROCK, false: DARK_GREY }}
                        style={{
                          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        }}
                        onValueChange={() => {
                          this.setState({
                            languages: this.state.languages.map((_language) => {
                              return {
                                ..._language,
                                selected:
                                  _language.Prefix === language.Prefix
                                    ? !_language.selected
                                    : _language.selected,
                              };
                            }),
                          });
                        }}
                      />
                    </ListItem>
                  );
                })}
              </View>
            </ScrollView>
            <Button
              title={localization.next}
              // disabled={this.state.selectedLanguages.length <= 0}
              titleStyle={[styles.uText]}
              buttonStyle={{ backgroundColor: DODGER_BLUE }}
              containerStyle={{
                marginTop: 15,
              }}
              onPress={() => {
                const selectedLanguages = this.state.languages.filter(
                  (language) => language.selected,
                );
                if (selectedLanguages.length <= 0) {
                  console.log('Nothing Selected');
                  Alert.alert(localization.selectLanguage.toUpperCase());
                } else {
                  this.downloadLanguages(selectedLanguages);
                  this.setState({
                    selectedLanguages,
                    downloadPageVisibility: true,
                    selectPageVisibility: false,
                  });
                }
              }}
            />
          </View>
        )}
        {this.state.downloadPageVisibility && (
          <View
            style={{
              margin: '10%',
              // width: '80%',
              flex: 1,
            }}>
            <ScrollView>
              <View
                style={{
                  borderRadius: 5,
                  padding: 5,
                  backgroundColor: '#FFF',
                }}>
                <ListItem key="languages">
                  <ListItem.Content>
                    <ListItem.Title>
                      <UText style={{ fontSize: 15 }}>
                        {localization.downloadPage}
                      </UText>
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                {this.state.selectedLanguages.map((language, index) => {
                  return (
                    <ListItem key={index}>
                      <ListItem.Content>
                        <ListItem.Title>
                          <UText style={{ fontSize: 14 }}>
                            {language.NativeName}
                          </UText>
                        </ListItem.Title>
                      </ListItem.Content>
                      {language.downloaded ? (
                        <UText style={{ color: SHAMROCK }}>
                          {localization.ready}
                        </UText>
                      ) : (
                        <UText style={{ color: DODGER_BLUE }}>
                          {localization.downloading} ...
                        </UText>
                      )}
                    </ListItem>
                  );
                })}
              </View>
            </ScrollView>
            {this.state.selectedLanguages.every(
              (language) => language.downloaded,
            ) && (
              <Button
                title={localization.next}
                titleStyle={[styles.uText]}
                buttonStyle={{ backgroundColor: DODGER_BLUE }}
                containerStyle={{
                  marginTop: 15,
                }}
                onPress={() => {
                  this.getDownloadedLanguages();
                }}
              />
            )}
          </View>
        )}
        {this.state.defaultPageVisibility && (
          <View
            style={{
              margin: '10%',
              width: '80%',
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{ borderRadius: 5, padding: 20, backgroundColor: '#FFF' }}>
              <UText style={{ fontSize: 15, marginBottom: 10 }}>
                {localization.defaultLanguage}
              </UText>
              <ListItem
                onPress={() => {
                  this.setState({
                    showPicker: true,
                  });
                }}>
                <ListItem.Content>
                  <ListItem.Title>
                    <UText style={{ fontSize: 15 }}>
                      {this.state.langObject[this.state.defaultLanguage]}
                    </UText>
                  </ListItem.Title>
                </ListItem.Content>
                <Icon name="arrow-drop-down" size={22} color={DARK_GREY} />
              </ListItem>
              {/* <Picker
                selectedValue={this.state.defaultLanguage}
                onValueChange={(defaultLanguage, itemIndex) => {
                  this.setDefaultLanguage(defaultLanguage);
                }}>
                {this.state.downloadedLanguages.map((language, index) => {
                  return (
                    <Picker.Item
                      key={index}
                      label={language.NativeName}
                      value={language.Prefix}
                    />
                  );
                })}
              </Picker> */}

              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.showPicker}>
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: '10%',
                    marginVertical: `${this.state.marginVertical}%`,
                    borderRadius: 10,
                    backgroundColor: WHITE,
                    padding: 20,
                  }}>
                  <UText style={{ fontSize: 20, marginBottom: 10 }}>
                    {localization.defaultLanguage}
                  </UText>
                  <ScrollView>
                    {this.state.downloadedLanguages.map((language, index) => {
                      return (
                        <ListItem
                          onPress={() => {
                            this.setDefaultLanguage(language.Prefix);
                          }}
                          bottomDivider>
                          <ListItem.Content>
                            <ListItem.Title>
                              <UText style={{ fontSize: 15, color: '#000' }}>
                                {language.NativeName}
                              </UText>
                            </ListItem.Title>
                          </ListItem.Content>
                          {this.state.defaultLanguage === language.Prefix && (
                            <Icon
                              name="check-circle"
                              size={18}
                              color={SHAMROCK}
                            />
                          )}
                        </ListItem>
                      );
                    })}
                  </ScrollView>
                </View>
              </Modal>
            </View>
            <Button
              title={localization.next}
              titleStyle={[styles.uText]}
              buttonStyle={{ backgroundColor: DODGER_BLUE }}
              containerStyle={{
                marginTop: 15,
              }}
              onPress={() => {
                this.props.navigation.navigate(COMP_TYPES.WAITING_AREA, {
                  isFromSetupPage: true,
                  welcomeMsg: localization.welcomeMsg,
                });
              }}
            />
          </View>
        )}
      </>
    );
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setLocalization,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  const { localization } = state;
  return {
    localization,
  };
}

export default connect(mapStateToProps, matchDispatchToProps)(LanguageSetup);
