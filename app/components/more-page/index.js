import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import History from '../history';
import Bookmark from '../bookmark';
import styles from '../styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getBookmarks, getHistories } from '../../controllers/actions';
import { DARK_GREY, WHITE } from '../color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COMP_TYPES } from '../../routers/types';
import UText from '../shared/u-text';

class MorePage extends Component {
  componentDidMount() {
    this.props.getBookmarks();
    this.props.getHistories();
    this.setNightMode();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nightMode !== this.props.nightMode) {
      this.setNightMode();
    }
  }

  setNightMode() {
    const nightMode = this.props.nightMode;
    const color = nightMode ? DARK_GREY : WHITE;
    const uTextStyle = nightMode
      ? { ...styles.settingTxt, color: DARK_GREY }
      : { ...styles.settingTxt, color: WHITE };
    const settingBtnStyle = nightMode
      ? { ...styles.settingBtn, backgroundColor: WHITE }
      : { ...styles.settingBtn, backgroundColor: DARK_GREY };
    this.props.navigation.setOptions({
      headerStyle: {
        backgroundColor: nightMode ? DARK_GREY : WHITE,
      },
      headerTitleStyle: {
        ...styles.mainHeaderTitle,
        color: nightMode ? WHITE : DARK_GREY,
      },
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.8}
          style={settingBtnStyle}
          onPress={() => this.props.navigation.navigate(COMP_TYPES.SETTING)}>
          <Icon name="settings" size={15} color={color} />
          <UText style={uTextStyle}>{this.props.localization.settings}</UText>
        </TouchableOpacity>
      ),
    });
  }

  render() {
    return (
      <View style={styles.morePage}>
        <View style={{ flex: 1 }}>
          <History navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 1 }}>
          <Bookmark navigation={this.props.navigation} />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { nightMode } = state.setting;
  const { localization } = state;
  return {
    nightMode,
    localization
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBookmarks,
      getHistories,
    },
    dispatch,
  );
}
export default connect(mapStateToProps, matchDispatchToProps)(MorePage);