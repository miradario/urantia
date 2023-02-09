import React, { Component, PureComponent } from "react";
import { FlatList } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setCompareLanguage,
  getCompareParts,
  getComparePapers,
  getCompareSections,
  getCompareContents,
  resetCompareContents,
} from "../../controllers/actions";
import { ListItem } from "react-native-elements";
import styles from "../styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { DARK_GREY, WHISPER, WHITE, SHAMROCK } from "../color";
import Loading from "../shared/loading";
import { OFF } from "../constants";
import UText from "../shared/u-text";
import { ROUTER_TYPES } from "../../routers/types";
import { CommonActions } from "@react-navigation/native";

class CompareLanguage extends PureComponent {
  state = {
    compareLanguages: [],
    loading: false,
  };

  componentDidMount() {
    this.getCompareLanguages();
    this.setNightMode();
  }

  componentDidUpdate(prevProps) {
    const prevContent =
      prevProps.compareContents.length > 0
        ? prevProps.compareContents[0][0]["Content"]
        : null;
    const currentContent =
      this.props.compareContents.length > 0
        ? this.props.compareContents[0][0]["Content"]
        : null;
    if (prevContent !== currentContent) {
      this.setState({
        loading: false,
      });
    }

    if (prevProps.nightMode !== this.props.nightMode) {
      this.setNightMode();
    }

    if (prevProps.compareLanguage !== this.props.compareLanguage) {
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: ROUTER_TYPES.MAIN_PAGE,
              params: { localization: this.props.localization },
            },
          ],
        })
      );
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

  setCompareLanguage = async (lang) => {
    const formattedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
    this.setState({
      loading: true,
    });
    if (lang === OFF.toLocaleLowerCase()) {
      console.log("enter here?");
      this.props.setCompareLanguage(formattedLang);
      setTimeout(() => {
        this.props.resetCompareContents();
      }, 1000);
      this.setState({
        loading: false,
      });
    } else if (lang !== this.props.compareLanguage.toLowerCase()) {
      console.log("language?");
      this.props.setCompareLanguage(formattedLang);
      this.props.getCompareParts(formattedLang);
      this.props.getComparePapers(formattedLang);
      this.props.getCompareSections(formattedLang);
      this.props.getCompareContents(formattedLang);
      this.setState({
        loading: false,
      });
    }
  };

  getCompareLanguages = () => {
    try {
      const langPrefix = this.props.language.toLowerCase();
      const compareLanguages = this.props.languages
        .filter((lang) => lang.Prefix !== langPrefix)
        .sort((prev, next) => prev.NativeName > next.NativeName);
      compareLanguages.unshift({
        Prefix: "off",
        NativeName: this.props.localization.off,
      });
      this.setState({
        compareLanguages,
      });
    } catch (error) {
      console.log(error);
    }
  };

  renderItem = ({ item: compareLanguage, index }) => {
    const { Prefix, NativeName } = compareLanguage;
    const { nightMode, fontSize } = this.props;
    const backgroundColor = nightMode ? DARK_GREY : WHISPER;
    const uTextStyle = nightMode
      ? { color: WHITE, fontSize }
      : { color: DARK_GREY, fontSize };
    return (
      <ListItem
        key={index}
        containerStyle={{ backgroundColor }}
        onPress={() => this.setCompareLanguage(Prefix)}
        bottomDivider
      >
        <ListItem.Content>
          <ListItem.Title>
            <UText style={uTextStyle}>{NativeName}</UText>
          </ListItem.Title>
        </ListItem.Content>
        {Prefix === this.props.compareLanguage.toLowerCase() ? (
          <Icon name="check-circle" size={22} color={SHAMROCK} />
        ) : null}
      </ListItem>
    );
  };

  render() {
    const backgroundColor = this.props.nightMode ? DARK_GREY : WHISPER;
    return (
      <>
        <Loading visible={this.state.loading} />
        <FlatList
          style={{ backgroundColor }}
          data={this.state.compareLanguages}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.Prefix}
        />
      </>
    );
  }
}

function mapStateToProps(state) {
  const { compareLanguage, language, languages, fontSize, nightMode } =
    state.setting;
  const { compareContents } = state.book;
  const { localization } = state;
  return {
    fontSize,
    compareLanguage,
    language,
    languages,
    compareContents,
    nightMode,
    localization,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setCompareLanguage,
      getCompareParts,
      getComparePapers,
      getCompareSections,
      getCompareContents,
      resetCompareContents,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(CompareLanguage);
