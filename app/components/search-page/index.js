import React, { Component } from "react";
import {
  FlatList,
  ActivityIndicator,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { COMP_TYPES } from "../../routers/types";

import { ListItem } from "react-native-elements";
import HTML from "react-native-render-html";
import { TextInput } from "react-native-gesture-handler";
import styles from "./styles";
import { DARK_GREY, RED_PIGMENT, WHITE } from "../color";
import { Picker } from "@react-native-picker/picker";
import UText from "../shared/u-text";
import DatabaseService from "../../services/database-service";
import SettingService from "../../services/setting-service";
import { DEFAULT_FONT } from "../constants";
// import { Modal } from 'react-native';

class SearchPage extends Component {
  timeoutId;
  state = {
    searchText: "",
    loading: false,
    filterBy: 0,
    showPreviousSearches: false,
    searchHistories: [],
    results: [],
  };

  componentDidMount() {
    this.props.navigation
      .dangerouslyGetParent()
      .dangerouslyGetParent()
      .setOptions({
        tabBarVisible: this.props.moreSpace,
      });
    this.setHeader();
  }

  componentDidUpdate(prevProps) {
    const { nightMode, results, fontSize } = prevProps;
    if (
      nightMode !== this.props.nightMode ||
      fontSize !== this.props.fontSize
    ) {
      this.setHeader();
    }
    if (results !== this.props.results) {
      this.setState({
        loading: false,
      });
    }
  }

  componentWillUnmount() {
    this.props.navigation
      .dangerouslyGetParent()
      .dangerouslyGetParent()
      .setOptions({
        tabBarVisible: true,
      });
  }

  setHeader() {
    const { fontSize } = this.props;
    const color = this.props.nightMode ? WHITE : DARK_GREY;
    const backgroundColor = this.props.nightMode ? DARK_GREY : WHITE;
    this.props.navigation.setOptions({
      headerStyle: {
        backgroundColor,
      },
      headerTitle: () => {
        return (
          <TextInput
            onSubmitEditing={(event) => {
              const searchText = event.nativeEvent.text;
              if (searchText) {
                this.getSearchContents({ searchText, newSearch: true });
              }
            }}
            ref={(input) => {
              this.textInput = input;
            }}
            placeholder={this.props.localization.search}
            placeholderTextColor="#7f8c8d"
            // onChangeText={(text) => this.onChangeSearch(text)}
            style={{
              color,
              backgroundColor,
              fontFamily: DEFAULT_FONT,
              fontSize,
            }}
          ></TextInput>
        );
      },
    });
  }

  getSearchHistories = async () => {
    const searchHistories = await SettingService.getSearchHistories();
    this.setState({
      searchHistories,
      showPreviousSearches: true,
    });
  };

  getSearchContents = async ({ searchText, newSearch }) => {
    try {
      this.setState({
        loading: true,
      });
      let results = await DatabaseService.searchContents(
        this.props.language,
        searchText
      );

      if (newSearch) {
        await SettingService.addSearchHistory({ searchText });
      }

      const state = {
        loading: false,
        searchText,
        results,
      };
      if (!newSearch) {
        state["showPreviousSearches"] = false;
        this.textInput.clear();
      }
      this.setState(state);
    } catch (error) {
      console.log({ error });
      this.setState({
        loading: false,
      });
    }
  };

  clearSearchHistories = async () => {
    try {
      await SettingService.clearSearchHistories();
      this.setState({
        searchHistories: [],
      });
    } catch (error) {}
  };

  renderItem = ({ item: result, index }) => {
    const { paper, content, paperNr, paperSec, paperPar, pageNr, lineNr } =
      result;
    const { fontSize } = this.props;
    const color = this.props.nightMode ? WHITE : DARK_GREY;
    const backgroundColor = this.props.nightMode ? DARK_GREY : WHITE;
    let paperInfo = `${this.props.localization.paper} ${paperNr} - ${paper}`;
    if (paperNr === 0) {
      paperInfo = paper;
    }
    console.log("content", content);
    let contentShow = content;
    while (contentShow.includes("</span> <span")) {
      contentShow = contentShow.replace("</span> <span", ` </span>&nbsp;<span`);
    }
    while (contentShow.includes("</span> <em")) {
      contentShow = contentShow.replace("</span> <em", ` </span>&emsp;<em`);
    }
    const titleBlock = `<p>${paperInfo}</p>`;
    const contentBlock = `<pre><p>${paperNr}:${paperSec}.${paperPar} ${contentShow}</p></pre>`;
    return (
      <ListItem
        key={index}
        containerStyle={{ backgroundColor }}
        onPress={() => {
          this.props.navigation.navigate(COMP_TYPES.CONTENT, {
            PageNr: pageNr,
            PaperNr: paperNr,
            PaperSec: paperSec,
            PaperPar: paperPar,
            LineNr: lineNr,
            searchText: this.state.searchText,
          });
        }}
        bottomDivider
      >
        <ListItem.Content>
          <HTML
            tagsStyles={{
              span: { color: RED_PIGMENT },
              p: { ...styles.searchPtag, fontSize, color },
              div: { margin: 0, padding: 0 },
              em: styles.em,
            }}
            source={{ html: `<div>${titleBlock}${contentBlock}</div>` }}
          />
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  };

  render() {
    const { fontSize } = this.props;
    const backgroundColor = this.props.nightMode ? DARK_GREY : WHITE;
    const color = this.props.nightMode ? WHITE : DARK_GREY;
    let results = this.state.results;
    const { filterBy } = this.state;
    if (filterBy !== 0) {
      results = this.state.results.filter((result) => {
        return this.props.papers[filterBy - 1].some((paper) => {
          return paper.PaperNr === result.paperNr;
        });
      });
    }
    return this.state.loading ? (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor,
        }}
      >
        <ActivityIndicator size="small" color="#7f8c8d" />
      </View>
    ) : (
      <>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showPreviousSearches}
        >
          <View
            style={{
              flex: 1,
              backgroundColor,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 10,
                backgroundColor,
              }}
            >
              <TouchableOpacity
                style={{ ...styles.cancelButton, backgroundColor: color }}
                onPress={() => {
                  this.setState({
                    showPreviousSearches: false,
                  });
                }}
              >
                <UText style={{ color: backgroundColor, fontSize }}>
                  {this.props.localization.back}
                </UText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.cancelButton,
                  backgroundColor: color,
                }}
                onPress={() => {
                  this.clearSearchHistories();
                }}
              >
                <UText style={{ color: backgroundColor, fontSize }}>
                  {this.props.localization.clearAll}
                </UText>
              </TouchableOpacity>
            </View>
            <ListItem
              key="search_history"
              bottomDivider
              containerStyle={{ backgroundColor, color }}
            >
              <ListItem.Content>
                <UText style={{ color, fontSize }}>
                  {this.props.localization.searchHistory}
                </UText>
              </ListItem.Content>
            </ListItem>
            {this.state.searchHistories.map((history, index) => {
              return (
                <ListItem
                  key={index}
                  bottomDivider
                  containerStyle={{ backgroundColor, color }}
                  onPress={() => {
                    this.getSearchContents({
                      searchText: history.searchText,
                      newSearch: false,
                    });
                  }}
                >
                  <ListItem.Content>
                    <UText style={{ color, fontSize }}>
                      {history.searchText}
                    </UText>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              );
            })}
          </View>
        </Modal>
        <View style={{ backgroundColor: "#bcbbc1" }}>
          <Picker
            selectedValue={this.state.filterBy}
            style={{ marginLeft: 18, fontFamily: DEFAULT_FONT }}
            itemStyle={{
              padding: 10,
              fontSize: 40,
              backgroundColor,
              fontFamily: DEFAULT_FONT,
              color: RED_PIGMENT,
              height: 50,
              transform: [{ scaleX: 1 }, { scaleY: 1 }],
            }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({
                filterBy: itemValue,
              })
            }
          >
            <Picker.Item label={this.props.localization.book} value={0} />
            {this.props.parts
              .filter((_filter) => _filter.PartNr !== 0)
              .map((part) => {
                return (
                  <Picker.Item
                    key={part.Prefix + part.Title + part.PartNr}
                    label={`${part.Prefix} / ${part.Title}`}
                    value={part.PartNr}
                  />
                );
              })}
          </Picker>
        </View>
        <ListItem
          bottomDivider
          containerStyle={{ backgroundColor, color }}
          key="search_history_page"
          onPress={() => {
            this.getSearchHistories();
          }}
        >
          <ListItem.Content>
            <UText style={{ color, fontSize }}>
              {this.props.localization.searchHistory}
            </UText>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <FlatList
          style={{ backgroundColor }}
          data={results}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </>
    );
  }
}

function mapStateToProps(state) {
  const { fontSize, language, moreSpace, nightMode } = state.setting;
  const { localization } = state;
  const { parts, papers } = state.book;
  return {
    language,
    fontSize,
    moreSpace,
    nightMode,
    localization,
    parts,
    papers,
  };
}

export default connect(mapStateToProps, null)(SearchPage);
