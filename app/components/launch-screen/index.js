import React, { Component } from 'react';
import { Text, View, Image, BackHandler, ClippingRectangle, LogBox } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getSettings,
  getLanguages,
  setLanguage,
  setCompareLanguage,
  getParts,
  getCompareParts,
  getPapers,
  getComparePapers,
  getSections,
  getCompareSections,
  getContents,
  getCompareContents,
  getHistories,
  getBookmarks,
  setLocalization,
} from '../../controllers/actions';
import { COMP_TYPES, ROUTER_TYPES } from '../../routers/types';
import SettingService from '../../services/setting-service';
import { OFF } from '../constants';
import UText from '../shared/u-text';
// import language from '../setting/language';
import styles from '../styles';
import CONFIG from '../../../config.json';
import Message from '../shared/message';
import UpgradeLocalization from '../../services/utils-service';
const ENV = CONFIG['ENV'];

class LaunchScreen extends Component {
  state = {
    loaded: false,
  };
  componentDidMount() {
    // console.disableYellowBox = true;
    LogBox.ignoreAllLogs();
    this.props.navigation.addListener('focus', (value) => {
      if (this.state.loaded) {
        BackHandler.exitApp();
      }
    });

    this.checkLanguages();
  }

  componentDidUpdate() {
    this.checkLanguages();
  }

  shouldComponentUpdate() {
    return false;
  }

  async checkLanguages() {
    try {
      // await SettingService.removeLanguages();
      const languages = await SettingService.getLanguages();
      if (languages && languages.length > 0) {
        this.setApplicationData();
      } else {
        // const fileName = `lang-urantia.db`;
        // const DOWNLOAD_URL = CONFIG['BASE_URL'][ENV] + fileName;
        // await FileService.download(DOWNLOAD_URL);
        this.props.navigation.navigate(COMP_TYPES.LANGUAGE_SETUP);
      }
    } catch (error) {
      console.log({ error });
      Message({
        title: 'Error occured while downloading the data.',
        subtitle: JSON.stringify(error),
      });
    }
  }
  setApplicationData = async () => {
    try {
      const response = await SettingService.getInitValues();
      await UpgradeLocalization();
      const language = response[0]['Language'];
      const compareLanguage = response[0]['CompareLanguage'];
      // const fontSize = response[0]['FontSize'];
      // await SettingService.clearBookmarks();
      this.props.setLocalization({
        prefix: language.toLowerCase(),
      });
      this.props.getSettings();

      const saveSetting = false;
      this.props.setLanguage(language, saveSetting);
      this.props.setCompareLanguage(compareLanguage, saveSetting);
      this.props.getLanguages();
      this.props.getParts(language);
      if (language !== compareLanguage && compareLanguage !== OFF) {
        this.props.getCompareParts(compareLanguage);
      }

      this.props.getPapers(language);
      this.props.getSections(language);
      this.props.getContents(language);
      if (language !== compareLanguage && compareLanguage !== OFF) {
        this.props.getComparePapers(compareLanguage);
        this.props.getCompareSections(compareLanguage);
        this.props.getCompareContents(compareLanguage);
      }
      this.setState({
        loaded: true,
      });
      setTimeout(() => {
        this.props.navigation.navigate(ROUTER_TYPES.MAIN_PAGE);
      }, 2000);
    } catch (error) {
      Message({
        title: 'Error occured while loading the data.',
        subtitle: JSON.stringify(error),
      });
    }
  }
  render() {
    const { isFromSetupPage, welcomeMsg } = this.props.route.params;
    return (
      <View style={styles.launchView}>
        {isFromSetupPage ? (
          <View>
            <View style={{ justifyContent: 'center' }}>
              {welcomeMsg && (
                <UText style={{ margin: 10, textAlign: 'center' }}>
                  {welcomeMsg} ...{' '}
                </UText>
              )}
            </View>
          </View>
        ) : (
          <Image
            resizeMode="center"
            source={require('../../assets/launch-bg.png')}
          />
        )}
      </View>
    );
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      // setDefaults,
      getSettings,
      getLanguages,
      setLanguage,
      setCompareLanguage,
      getParts,
      getCompareParts,
      getPapers,
      getComparePapers,
      getSections,
      getCompareSections,
      getContents,
      getCompareContents,
      getHistories,
      getBookmarks,
      setLocalization,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  const { nightMode } = state.setting;
  return {
    nightMode,
  };
}

export default connect(mapStateToProps, matchDispatchToProps)(LaunchScreen);
