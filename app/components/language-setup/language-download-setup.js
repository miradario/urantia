import React, { Component } from 'react';
import { BackHandler, View } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import UText from '../shared/u-text';
import FileService from '../../services/file-service';
import { DARK_GREY, DODGER_BLUE, SHAMROCK, WHITE } from '../color';
import SettingService from '../../services/setting-service';
import { COMP_TYPES } from '../../routers/types';
import styles from '../styles';
import CONFIG from '../../../config.json';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLocalization } from '../../controllers/actions';

const ENV = CONFIG['ENV'];

class LanguageDownloadSetup extends Component {
  constructor(props) {
    super(props);
    const { selectedLanguages } = props.route.params;
    this.state = {
      selectedLanguages,
    };
  }

  componentDidMount() {
    this.downloadLanguages();
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('hardwareBackPress');
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  async downloadLanguages() {
    try {
      await Promise.all(
        this.state.selectedLanguages.map((language) => {
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
              alert
              reject(error);
            }
          });
        }),
      );
    } catch (error) {
      console.log({ error });
    }
  }

  async next() {
    const downloadedLanguages = this.state.selectedLanguages.sort(
      (prev, next) => prev.NativeName > next.NativeName,
    );
    if (downloadedLanguages.length > 0) {
      const { Prefix: defaultLanguage } = downloadedLanguages[0];
      param = {
        defaultLanguage,
      };
      await SettingService.setLanguage(defaultLanguage);
      this.props.setLocalization({ prefix: defaultLanguage });
      this.props.navigation.push(COMP_TYPES.LANGUAGE_DEFAULT_SETUP, {
        downloadedLanguages,
        defaultLanguage,
      });
    }
  }

  render() {
    const { localization } = this.props;
    return (
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
              this.next();
            }}
          />
        )}
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

export default connect(
  mapStateToProps,
  matchDispatchToProps,
)(LanguageDownloadSetup);
