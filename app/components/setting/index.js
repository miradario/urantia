import React, { Component } from 'react';
import { FlatList, Text } from 'react-native';
import { COMP_TYPES } from '../../routers/types';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { OFF } from '../constants';
import UText from '../shared/u-text';
import { bindActionCreators } from 'redux';
import {
  setNightMode,
  setMoreSpace,
  setReferenceNumber,
} from '../../controllers/actions';
import USwitch from '../shared/u-switch';
import { DARK_GREY, WHISPER, WHITE } from '../color';
import styles from '../styles';

class Setting extends Component {
  state = {
    settings: [
      {
        name: this.props.localization.language,
        routeName: COMP_TYPES.LANGUAGE,
        disabled: false,
        // extraData: this.props.language,
        trailing: (title, uTextStyle) => (
          <UText style={uTextStyle}>{title}</UText>
        ),
      },
      {
        name: this.props.localization.compareLanguage,
        routeName: COMP_TYPES.COMPARE_LANGUAGE,
        disabled: false,
        // extraData: this.props.compareLanguage,
        trailing: (title, uTextStyle) => (
          <UText style={uTextStyle}>{title}</UText>
        ),
      },
      {
        name: this.props.localization.manageLanguages,
        routeName: COMP_TYPES.LANGUAGE_MANAGE,
        disabled: false,
        // extraData: this.props.compareLanguage,
        trailing: () => {
          return <ListItem.Chevron />;
        },
      },
      {
        name: this.props.localization.textSize,
        routeName: COMP_TYPES.STYLING,
        disabled: false,
        extraData: null,
        trailing: () => {
          return <ListItem.Chevron />;
        },
      },
      {
        name: this.props.localization.nightMode,
        disabled: true,
        extraData: null,
        trailing: () => {
          return (
            <USwitch
              isEnabled={this.props.nightMode}
              toggleSwitch={this.props.setNightMode}
            />
          );
        },
      },
      {
        name: this.props.localization.referenceNumber,
        disabled: true,
        extraData: null,
        trailing: () => {
          return (
            <USwitch
              isEnabled={this.props.referenceNumber}
              toggleSwitch={this.props.setReferenceNumber}
            />
          );
        },
      },
      {
        name: this.props.localization.toolBar,
        disabled: true,
        extraData: null,
        trailing: () => {
          return (
            <USwitch
              isEnabled={this.props.moreSpace}
              toggleSwitch={this.props.setMoreSpace}
            />
          );
        },
      },
    ],
  };

  componentDidMount() {
    this.setNightMode();
    // console.log(this.props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nightMode !== this.props.nightMode) {
      this.setNightMode();
    }
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

  displayNativeName = (inputLang) => {
    if (inputLang) {
      const index = this.props.languages.findIndex((lang) => {
        return lang['Prefix'] === inputLang.toLowerCase();
      });
      return inputLang === OFF
        ? this.props.localization.off
        : this.props.languages[index]['NativeName'];
    }
  };

  renderItem = ({ item: setting, index }) => {
    const { fontSize, nightMode } = this.props;
    const backgroundColor = nightMode ? DARK_GREY : WHISPER;
    const uTextStyle = nightMode
      ? { color: WHITE, fontSize }
      : { color: DARK_GREY, fontSize };
    let extraData = undefined;
    if (index === 0) {
      extraData = this.props.language;
    } else if (index === 1) {
      extraData = this.props.compareLanguage;
    }
    return (
      <ListItem
        key={index}
        containerStyle={{ backgroundColor }}
        onPress={() =>
          this.props.navigation.navigate(setting.routeName, {
            ...setting.params,
          })
        }
        disabled={setting.disabled}
        bottomDivider>
        <ListItem.Content>
          <ListItem.Title>
            <UText style={uTextStyle}>{setting.name}</UText>
          </ListItem.Title>
        </ListItem.Content>
        {setting.trailing(this.displayNativeName(extraData), uTextStyle)}
        {index < 2 && <ListItem.Chevron />}
      </ListItem>
    );
  };

  render() {
    const backgroundColor = this.props.nightMode ? DARK_GREY : WHISPER;
    return (
      <FlatList
        style={{ backgroundColor }}
        data={this.state.settings}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

function mapStateToProps(state) {
  const { language, compareLanguage, languages } = state.setting;
  const { fontSize, nightMode, moreSpace, referenceNumber } = state.setting;
  const { localization } = state;
  return {
    language,
    compareLanguage,
    languages,
    fontSize,
    nightMode,
    moreSpace,
    referenceNumber,
    localization,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setNightMode,
      setMoreSpace,
      setReferenceNumber,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(Setting);
