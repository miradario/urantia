import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setLanguage,
  getParts,
  getPapers,
  getSections,
  getContents,
  setLocalization,
} from '../../controllers/actions';
import { Button, ListItem } from 'react-native-elements';
import styles from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DARK_GREY, WHISPER, WHITE, SHAMROCK } from '../color';
import Loading from '../shared/loading';
import UText from '../shared/u-text';
import { COMP_TYPES, ROUTER_TYPES } from '../../routers/types';
import { CommonActions } from '@react-navigation/native';
class Language extends Component {
  state = { loading: false };
  componentDidUpdate(prevProps) {
    const prevContent =
      prevProps.contents.length > 0
        ? prevProps.contents[0][0]['Content']
        : null;
    const currentContent =
      this.props.contents.length > 0
        ? this.props.contents[0][0]['Content']
        : null;
    if (prevContent !== currentContent) {
      this.setState({
        loading: false,
      });
    }

    if (prevProps.nightMode !== this.props.nightMode) {
      this.setNightMode();
    }
    if (prevProps.localization.prefix !== this.props.localization.prefix) {
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: ROUTER_TYPES.MAIN_PAGE,
              params: { localization: this.props.localization },
            },
          ],
        }),
      );
    }
  }

  componentDidMount() {
    this.setNightMode();
  }

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

  setLanguage = async (lang) => {
      console.log("\n\nLanguage Pick 74\nLang Value: " + lang +"\nthis.props.language: " + this.props.language+"\n");
    if (lang !== this.props.language.toLowerCase()) {
      this.setState({
        loading: true,
      });
      const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
      this.props.setLocalization({
        prefix: lang,
      });
      console.log("\n\nLanguage Pick 83\nLanguage Set to localization: " + capitalizedLang+"\n");
      this.props.setLanguage(capitalizedLang);
      this.props.getParts(capitalizedLang);
      this.props.getPapers(capitalizedLang);
      this.props.getSections(capitalizedLang);
      this.props.getContents(capitalizedLang);
    }
  };

  renderItem = ({ item: language, index }) => {
    const { Prefix, NativeName } = language;
    const { fontSize, nightMode, languages, compareLanguage } = this.props;
    const backgroundColor = nightMode ? DARK_GREY : WHISPER;
    const uTextStyle = nightMode
      ? { color: WHITE, fontSize }
      : { color: DARK_GREY, fontSize };
    return (
      <>
        <ListItem
          key={index}
          containerStyle={{ backgroundColor }}
          onPress={() => this.setLanguage(Prefix)}
          disabled={Prefix === compareLanguage.toLowerCase()}
          bottomDivider>
          <ListItem.Content>
            <ListItem.Title>
              <UText style={uTextStyle}>{NativeName}</UText>
            </ListItem.Title>
          </ListItem.Content>
          {Prefix === this.props.language.toLowerCase() ? (
            <Icon name="check-circle" size={18} color={SHAMROCK} />
          ) : null}
          {Prefix === compareLanguage.toLowerCase() && (
            <UText style={{ fontSize: 12 }}>
              {this.props.localization.compareLanguage}
            </UText>
          )}
        </ListItem>
      </>
    );
  };

  render() {
    const backgroundColor = this.props.nightMode ? DARK_GREY : WHISPER;
    return (
      <>
        <Loading
          visible={this.state.loading}
          msg={this.props.localization.settingUpLanguage}
        />
        <FlatList
          style={{ backgroundColor }}
          data={this.props.languages.sort((prev, next) => prev.NativeName > next.NativeName)}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.Prefix}
        />
      </>
    );
  }
}

function mapStateToProps(state) {
  const {
    language,
    languages,
    compareLanguage,
    fontSize,
    nightMode,
  } = state.setting;
  const { contents } = state.book;
  const { localization } = state;
  return {
    fontSize,
    language,
    compareLanguage,
    languages,
    contents,
    nightMode,
    localization,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setLocalization,
      setLanguage,
      getParts,
      getPapers,
      getSections,
      getContents,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(Language);
