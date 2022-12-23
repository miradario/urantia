import React, { Component } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { ListItem, Button, colors, Card, Icon } from 'react-native-elements';
import UText from '../shared/u-text';
import FileService from '../../services/file-service';
import { DARK_GREY, DODGER_BLUE, SHAMROCK, WHISPER, WHITE } from '../color';
import SettingService from '../../services/setting-service';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getLanguages } from '../../controllers/actions';
import styles from '../styles';
import CONFIG from '../../../config.json';
import { ScrollView } from 'react-native-gesture-handler';
import { DEFAULT_FONT } from '../constants';
const ENV = CONFIG['ENV'];

class LanguageDownload extends Component {
  state = {
    availableLanguages: [],
    downloading: false,
  };

  componentDidMount() {
    this.getLanguages();
    this.setNightMode();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nightMode !== this.props.nightMode) {
      this.setNightMode();
    }
  }

  async getLanguages() {
    try {
      // const languages = await DatabaseService.getLanguages();
      const languages = await FileService.getLanguages();
      this.setState({
        availableLanguages: languages.map((lang) => ({
          ...lang,
          selected: false,
          downloaded:
            this.props.languages.findIndex(
              (_lang) => _lang.Prefix === lang.Prefix,
            ) >= 0,
        })),
      });
    } catch (error) {
      console.log({ error });
    }
  }

  downloadLanguages = async () => {
    try {
      const languages = this.state.availableLanguages.filter(
        (lang) => lang.selected && !lang.downloaded,
      );
      if (languages.length > 0) {
        this.setState({
          downloading: true,
        });
        await Promise.all(
          languages.map((language) => {
            return new Promise(async (resolve, reject) => {
              try {
                const fileName = language.Prefix + '-urantia.db';
                const downloadUrl = CONFIG['BASE_URL'][ENV] + fileName;
                await FileService.download(downloadUrl);
                await SettingService.addLanguage(language);
                this.setState({
                  availableLanguages: this.state.availableLanguages.map(
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
                resolve();
              } catch (error) {
                console.log({ error });
                reject(error);
              }
            });
          }),
        );
        this.props.getLanguages();
      }
    } catch (error) {
      console.log({ error });
    } finally {
      this.setState({
        downloading: false,
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

  async getDownloadedLanguages() {
    try {
      const downloadedLanguages = await SettingService.getLanguages();
      this.setState({
        downloadedLanguages,
      });
    } catch (error) {
      console.log({ error });
    }
  }

  render() {
    const {
      download,
      downloading,
      availableLanguages,
    } = this.props.localization;
    const backgroundColor = this.props.nightMode ? DARK_GREY : WHISPER;
    const color = this.props.nightMode ? WHISPER : DARK_GREY;
    return (
      <ScrollView style={{ flex: 1, backgroundColor }}>
        <Card
          containerStyle={{
            justifyContent: 'center',
            marginBottom: 10,
            backgroundColor,
          }}>
          <UText
            style={{ marginLeft: 15, fontSize: 15, marginVertical: 10, color }}>
            {availableLanguages}
          </UText>
          {this.state.availableLanguages.map((language, index) => {
            return (
              // <ListItem key={index} containerStyle={{ backgroundColor }}>
              <ListItem key={index} onPress={() => {
                  this.setState({
                      availableLanguages: this.state.availableLanguages.map(
                        (_language) => {
                          return {
                            ..._language,
                            selected:
                              _language.Prefix === language.Prefix
                                ? !_language.selected
                                : _language.selected,
                          };
                        },
                      ),
                  });
              }}
              containerStyle={{ backgroundColor }}>
                <ListItem.Content>
                  <UText style={{ color }}>{language.NativeName}</UText>
                </ListItem.Content>
                {language.downloaded ? (
                  <Icon
                    name="check-circle"
                    size={18}
                    color={SHAMROCK}
                    style={{ marginRight: 6 }}
                  />
                ) : (
                  <CheckBox
                    value={language.selected}
                    tintColors={{ true: SHAMROCK, false: color }}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    disabled={this.state.downloading}
                    onValueChange={() => {
                      this.setState({
                        availableLanguages: this.state.availableLanguages.map(
                          (_language) => {
                            return {
                              ..._language,
                              selected:
                                _language.Prefix === language.Prefix
                                  ? !_language.selected
                                  : _language.selected,
                            };
                          },
                        ),
                      });
                    }}
                  />
                )}
              </ListItem>
            );
          })}
          <Button
            title={this.state.downloading ? `${downloading} ...` : download}
            titleStyle={{
              fontSize: 15,
              fontFamily: DEFAULT_FONT,
            }}
            disabled={this.state.downloading}
            buttonStyle={{ paddingHorizontal: 12 }}
            containerStyle={{ alignSelf: 'center', marginTop: 10 }}
            onPress={this.downloadLanguages}
          />
        </Card>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  const { languages, nightMode } = state.setting;
  const { localization } = state;
  return {
    languages,
    localization,
    nightMode,
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

export default connect(mapStateToProps, matchDispatchToProps)(LanguageDownload);
