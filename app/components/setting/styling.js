import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Slider } from 'react-native-elements';
import { SHAMROCK, DARK_GREY, WHITE, WHISPER } from '../color';
import UText from '../shared/u-text';
import styles from '../../components/styles';
import { setFontSize } from '../../controllers/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Styling extends Component {
  //   state = { textSize: }
  componentDidMount() {
    this.setNightMode();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nightMode !== this.props.nightMode) {
      this.setNightMode();
    }
  }

  setNightMode() {
    const { nightMode } = this.props;
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

  onTextSizeValueChange = (value) => {
    this.props.setFontSize(value);
  };

  render() {
    const { nightMode } = this.props;
    const backgroundColor = nightMode ? DARK_GREY : WHISPER;
    const color = nightMode ? WHITE : DARK_GREY;
    return (
      <View style={{ padding: 20, backgroundColor, flex: 1 }}>
        <View style={styles.sliderTitleParent}>
          <UText style={{ color }}>{this.props.localization.textSize}</UText>
          <UText style={{ ...styles.valueBox, color }}>
            {this.props.fontSize}
          </UText>
        </View>
        <Slider
          value={this.props.fontSize}
          step={1}
          onSlidingComplete={this.onTextSizeValueChange}
          style={{ marginLeft: 2 }}
          minimumValue={10}
          maximumValue={30}
          thumbStyle={styles.thumb}
          trackStyle={{ height: 2 }}
          thumbTintColor={WHITE}
          minimumTrackTintColor={SHAMROCK}
        />

        {/* <UText style={{ marginTop: 20 }}> Sepia </UText>
        <Slider
          style={{ marginLeft: 2 }}
          minimumValue={10}
          maximumValue={20}
          thumbStyle={styles.thumb}
          trackStyle={{ height: 2 }}
          thumbTintColor={SLIDER_THUMB_TINT}
          minimumTrackTintColor={SLIDER_CLR}
        />
        <UText style={{ marginTop: 20 }}> Margin </UText>
        <Slider
          style={{ marginLeft: 2 }}
          minimumValue={10}
          maximumValue={20}
          thumbStyle={styles.thumb}
          trackStyle={{ height: 2 }}
          thumbTintColor={SLIDER_THUMB_TINT}
          minimumTrackTintColor={SLIDER_CLR}
        /> */}
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { fontSize, nightMode } = state.setting;
  const { localization } = state;
  return {
    fontSize,
    nightMode,
    localization
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setFontSize,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(Styling);
