import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { ListItem, Button } from 'react-native-elements';
import UText from '../shared/u-text';
import FileService from '../../services/file-service';
import { DARK_GREY, DODGER_BLUE, SHAMROCK, WHITE } from '../color';
import { COMP_TYPES } from '../../routers/types';
import styles from '../styles';
import { NativeModules } from 'react-native';
import CONFIG from '../../../config.json';
import { ScrollView } from 'react-native-gesture-handler';
import UpgradeLocalization from '../../services/utils-service';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLocalization } from '../../controllers/actions';

const ENV = CONFIG['ENV'];

class LanguageSetup extends Component {
  state = {
    languages: [],
    selectedLanguages: [],
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

  render() {
    // const { localizations } = this.state;
    const { localization } = this.props;
    return (
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
              this.props.navigation.push(COMP_TYPES.LANGUAGE_DOWNLOAD_SETUP, {
                selectedLanguages
              });
            }
          }}
        />
      </View>
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
