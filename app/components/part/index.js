import React, { Component } from "react";
import { FlatList, Modal, View } from "react-native";
import { connect } from "react-redux";
import { COMP_TYPES } from "../../routers/types";
import { bindActionCreators } from "redux";
import { getParts, getCompareParts } from "../../controllers/actions";
import RenderItem from "../shared/render-item";
import {
  CONCRETE,
  DARK_GREY,
  DODGER_BLUE,
  GEYSER,
  RED_PIGMENT,
  SHAMROCK,
  WHITE,
} from "../color";
import styles from "../styles";
import SettingService from "../../services/setting-service";
import FileService from "../../services/file-service";
import UText from "../shared/u-text";
import { Button } from "react-native-elements";
import { DEFAULT_FONT } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

class Part extends Component {
  state = {
    updateAvailable: false,
  };

  async componentDidMount() {
    this.setNightMode();
    try {
      const _downloadedLanguages = await SettingService.getLanguages();
      const langs = await FileService.getLanguages();
      if (langs && langs.length > 0) {
        const versions = langs.map((lang) => lang.Version);
        this.setState({
          updateAvailable: !_downloadedLanguages.every((lang) =>
            versions.includes(lang.Version)
          ),
        });
      }
      const state = await AsyncStorage.getItem("@save_state");
      /* 
      19-1 DM this is the code that redirects to the last page the user was on before closing the app 
      
      if (state) {
        const { PageNr, PaperNr, PaperSec, LineNr, y } = JSON.parse(state);
        this.props.navigation.navigate(COMP_TYPES.CONTENT, {
          PageNr,
          PaperNr,
          PaperSec,
          LineNr,
          y,
          fromHistory: false,
          fromBookmark: false,
          fromRedirect: true
        });
      } */
    } catch (error) {
      console.log({ error });
    }
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
        ...styles.mainHeaderTitle,
        color: nightMode ? WHITE : DARK_GREY,
      },
    });
  }

  renderItem = ({ item: part, index }) => {
    let { Prefix: title, Title: subtitle, PartNr: partNo } = part;
    let compareTitle;
    let compareSubtitle;
    const { compareParts } = this.props;
    if (compareParts.length > 0) {
      compareTitle = ` / ${compareParts[partNo]["Prefix"]}`;
      compareSubtitle = ` / ${compareParts[partNo]["Title"]}`;
    }
    if (partNo === 0) {
      subtitle = null;
    }
    const { fontSize } = this.props;
    return (
      <RenderItem
        style={{ fontSize }}
        nightMode={this.props.nightMode}
        index={index}
        title={title}
        compareTitle={compareTitle}
        subtitle={subtitle}
        compareSubTitle={compareSubtitle}
        navigate={() => {
          if (partNo === 0) {
            this.props.navigation.push(COMP_TYPES.SECTION, {
              paperNo: 0,
            });
          } else {
            this.props.navigation.navigate(COMP_TYPES.PAPER, {
              partNo: partNo - 1,
            });
          }
        }}
      />
    );
  };
  render() {
    const backgroundColor = this.props.nightMode ? DARK_GREY : CONCRETE;
    const { yes, no, updateNowMsg, updateNow } = this.props.localization;
    let { fontSize } = this.props;
    // setTimeout(() => {
    //   ToastAndroid.showWithGravityAndOffset(
    //     this.props.localization.updateNowMsg,
    //     ToastAndroid.LONG,
    //     ToastAndroid.BOTTOM,
    //     0,
    //     300,
    //   );
    // }, 2000);
    fontSize += 3;
    const containerStyle = {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      height: 100,
      padding: 5,
    };
    const buttonStyle = {
      borderRadius: 20,
      backgroundColor: RED_PIGMENT,
      width: 80,
    };
    const uTextStyle = { fontSize, textAlign: "center", marginBottom: 10 };
    const titleStyle = { fontFamily: DEFAULT_FONT };
    return (
      <>
        <FlatList
          style={{ backgroundColor }}
          data={this.props.parts}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.updateAvailable}
          //visible={true}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                width: "80%",
                height: "30%",
                backgroundColor: GEYSER,
                borderRadius: 10,
                paddingTop: 20,
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: 1,
              }}
            >
              <UText style={uTextStyle}>{updateNowMsg}</UText>
              <UText style={uTextStyle}>{updateNow}</UText>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  title={no}
                  titleStyle={titleStyle}
                  buttonStyle={buttonStyle}
                  containerStyle={containerStyle}
                  onPress={() => {
                    this.setState({
                      updateAvailable: false,
                    });
                  }}
                />
                <Button
                  title={yes}
                  titleStyle={titleStyle}
                  buttonStyle={{ ...buttonStyle, backgroundColor: SHAMROCK }}
                  containerStyle={containerStyle}
                  onPress={() => {
                    this.setState({
                      updateAvailable: false,
                    });
                    this.props.navigation.navigate(COMP_TYPES.UPDATE_AREA);
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { parts, compareParts } = state.book;
  const { fontSize, nightMode } = state.setting;
  const { localization } = state;
  return {
    parts,
    compareParts,
    fontSize,
    nightMode,
    localization,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getParts,
      getCompareParts,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(Part);
