import React, { Component } from "react";
// import * as Animatable from 'react-native-animatable';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
  Clipboard,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styles from "../styles";
import {
  getContents,
  getCompareContents,
  removeBookmark,
  addBookmark,
} from "../../controllers/actions";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COMP_TYPES, ROUTER_TYPES } from "../../routers/types";
import BackButton from "../shared/back-button";
import { DARK_GREY, DODGER_BLUE, WHITE } from "../color";
import { Icon as RnIcon } from "react-native-elements";
import ContentView from "./content-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import GestureRecognizer from 'react-native-swipe-gestures';
// import { AfterInteractions } from 'react-native-interactions';

class Content extends Component {
  constructor(props) {
    super(props);
    const { LineNr } = this.props.route.params;
    this.scrollView = React.createRef();
    this.state = {
      index: this.props.contentLineNumbers[LineNr],
      y: null,
    };
  }

  // List of top level keys in this.props
  // "navigation","route","contents","contentLineNumbers",
  // "compareContents","bookmarks","referenceNumber","moreSpace",
  // "nightMode","localization","addBookmark","removeBookmark",
  // "getContents","getCompareContents"

  componentDidMount() {
    // console.log("Content Component Mount- Content");
    this.props.navigation.dangerouslyGetParent().setOptions({
      tabBarVisible: this.props.moreSpace,
    });
    this.setNightMode();
    this.onViewableItemsChanged(this.state.index);
  }

  componentWillUnmount() {
    this.props.navigation.dangerouslyGetParent().setOptions({
      tabBarVisible: true,
    });
  }

  componentDidUpdate(prevProps) {
    this.props.navigation.dangerouslyGetParent().setOptions({
      tabBarVisible: this.props.moreSpace,
    });

    // console.log("Props Route: ", this.props.route);
    let route = {
      LineNr: this.props.route.params["LineNr"],
      PageNr: this.props.route.params["PageNr"],
      PaperNr: this.props.route.params["PaperNr"],
      PaperSec: this.props.route.params["PaperSec"],
      y: this.props.route.params["y"],
    };
    // console.log("Route: ", route);
    // console.log("Current Content: ", this.props.contents[this.state.index][0]);
    let current = {
      LineNr: this.props.contents[this.state.index][0]["LineNr"],
      PageNr: this.props.contents[this.state.index][0]["PageNr"],
      PaperNr: this.props.contents[this.state.index][0]["PaperNr"],
      PaperSec: this.props.contents[this.state.index][0]["PaperSec"],
    };
    // console.log("Current: ", current);
    if (
      current.PaperNr !== route.PaperNr ||
      current.PaperSec !== route.PaperSec
    ) {
      // console.log("Navigate Replace");
      this.props.route.params = {
        LineNr: current.LineNr,
        PageNr: current.PageNr,
        PaperNr: current.PaperNr,
        PaperSec: current.PaperSec,
        fromBookmark: false,
        fromHistory: false,
        shouldUpdate: true,
      };
    }

    if (route.y) {
      this.jumpToParagraph({ x: 0, y: route.y });
    }

    const jsonValue = JSON.stringify(route);
    AsyncStorage.setItem("@save_state", jsonValue);
    // console.log("Route: ", this.props.route);
    if (prevProps.nightMode !== this.props.nightMode) {
      this.setNightMode();
    }
  }

  handleViewRef = (ref) => (this.view = ref);

  setHeader = (contentProps) => {
    const { searchText } = this.props.route.params;
    const { PaperNr, PaperSec } = contentProps;
    const { forward } = this.props.localization;
    // console.log({forward});
    let title = `${PaperNr}:${PaperSec}`;
    if (PaperNr === 0) {
      title = forward;
    }
    this.props.navigation.setOptions({
      title,
      headerRight: (props) => {
        const color = this.props.nightMode ? WHITE : DARK_GREY;
        return (
          <View
            style={{
              marginRight: 5,
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              // backgroundColor: '#F98',
            }}
          >
            {!searchText && (
              <RnIcon
                reverse
                raised
                size={12}
                name="search"
                type="ionicon"
                color={DODGER_BLUE}
                reverseColor="#FFF"
                containerStyle={{ marginRight: 10 }}
                onPress={async () => {
                  await AsyncStorage.removeItem("@save_state");
                  this.props.navigation.navigate(ROUTER_TYPES.SEARCH_PAGE);
                }}
              />
            )}
            {this.props.bookmarks
              .map((bookmark) => bookmark.LineNr)
              .includes(contentProps.LineNr) ? (
              <TouchableOpacity
                onPress={() => this.removeBookmark(contentProps)}
              >
                <Icon name="bookmark" size={25} color={color} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => this.addBookmark(contentProps)}>
                <Icon name="bookmark-border" size={25} color={color} />
              </TouchableOpacity>
            )}
          </View>
        );
      },
    });
  };

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

  setBackButton = (paperNo) => {
    const { fromBookmark, fromHistory } = this.props.route.params;
    const { sections, bookmark, history } = this.props.localization;
    let name = sections;
    let routeName = COMP_TYPES.SECTION;
    if (fromBookmark) {
      name = bookmark;
      routeName = COMP_TYPES.MORE;
    } else if (fromHistory) {
      name = history;
      routeName = COMP_TYPES.MORE;
    }
    this.props.navigation.setOptions({
      headerLeft: (props) => {
        return (
          <BackButton
            name={name}
            navigate={this.props.navigation.navigate}
            routeName={routeName}
            params={{
              paperNo,
              revert: true,
            }}
          />
        );
      },
    });
  };

  addBookmark = (contentProps) => {
    this.props.addBookmark(contentProps);
    this.setHeader(contentProps);
    this.props.navigation.setParams({
      shouldUpdate: false,
    });
  };

  removeBookmark = (contentProps) => {
    this.props.removeBookmark(contentProps.LineNr);
    this.setHeader(contentProps);
    this.props.navigation.setParams({
      shouldUpdate: false,
    });
  };

  onViewableItemsChanged = (index) => {
    const content = this.props.contents[index];
    if (content[0]) {
      const { PageNr, LineNr, PaperNr, PaperSec } = content[0];
      this.setHeader({ PageNr, LineNr, PaperNr, PaperSec });
      const { shouldUpdate, fromRedirect } = this.props.route.params;
      if (!shouldUpdate) {
        this.props.navigation.setParams({
          shouldUpdate: true,
        });
      }

      if (this.props.route.params.revert) {
        this.setBackButton(PaperNr);
      } else if (this.props.route.params.PaperNr != PaperNr) {
        this.props.navigation.setParams({
          PaperNo: PaperNr,
          shouldUpdate: true,
        });
        const { sections } = this.props.localization;
        let paperNo = PaperNr;
        this.props.route.params.PaperNr = PaperNr;
        this.props.navigation.setOptions({
          headerLeft: () => {
            return (
              <BackButton
                name={sections}
                navigate={this.props.navigation.navigate}
                routeName={COMP_TYPES.SECTION}
                params={{
                  paperNo,
                  revert: true,
                }}
              />
            );
          },
        });
      } else if (fromRedirect) {
        const { sections } = this.props.localization;
        this.props.navigation.setOptions({
          headerLeft: () => {
            return (
              <BackButton
                name={sections}
                navigate={async () => {
                  await AsyncStorage.removeItem("@save_state");
                  this.props.navigation.goBack();
                }}
              />
            );
          },
        });
      }
    }
  };

  jumpToParagraph = ({ x, y }) => {
    if (!this.state.y || y < this.state.y) {
      this.setState({
        y,
      });
      this.scrollView.current.scrollToOffset({ animated: true, offset: y });
    }
  };

  jumpToParagraphIndex = (index) => {
    this.scrollView.current.scrollToIndex({ animated: true, index });
  };

  setY = async (y) => {
    const state = await AsyncStorage.getItem("@save_state");
    if (state) {
      const jsonState = JSON.parse(state);
      jsonState["y"] = y;
      await AsyncStorage.setItem("@save_state", JSON.stringify(jsonState));
    }
  };

  render() {
    const {
      searchText,
      PaperNr: SearchPaperNr,
      PaperSec: SearchPaperSec,
      PaperPar: SearchPaperPar,
    } = this.props.route.params;

    const onSwipeLeft = () => {
      if (this.state.index > 0) {
        const index = this.state.index - 1;
        this.onViewableItemsChanged(index);
        this.setState({
          index,
        });
      }
    };

    const onSwipeRight = () => {
      if (this.state.index < this.props.contents.length - 1) {
        const index = this.state.index + 1;
        this.onViewableItemsChanged(index);
        this.setState({
          index,
        });
      }
    };

    const backgroundColor = this.props.nightMode ? DARK_GREY : WHITE;
    let onStart;
    let origin;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <FlatList
          onTouchStart={(e) => {
            const { pageX, pageY } = e.nativeEvent;
            onStart = pageX;
            origin = [pageX, pageY];
          }}
          onScroll={(e) => {
            console.log(e.nativeEvent.contentOffset.x);
            console.log(e.nativeEvent.contentOffset.y);
          }}
          onScrollEndDrag={(e) => {
            this.setY(e.nativeEvent.contentOffset.y);
          }}
          onMoveShouldSetResponder={(evt) => true}
          onResponderMove={(e) => {
            const { pageX, pageY } = e.nativeEvent;
            const distance = 15;
            const diff = Math.abs(onStart - pageX);

            if (origin !== undefined) {
              let [deltaX, deltaY] = [pageX - origin[0], origin[1] - pageY];
              let deg = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
              let mag = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

              if (deg >= -35 && deg <= 35 && mag > 40) {
                setTimeout(() => {
                  onSwipeLeft();
                  this.scrollView.current.scrollToOffset({
                    offset: 0,
                    animated: false,
                  });
                });
              } else if ((deg <= -145 || deg >= 145) && mag > 40) {
                // setTimeout resolves issue where being at absolute
                // bottom of a page results in moving to next page without
                // scrolling to top. Fractional delay works so something
                // about order of execution is concurrent. Will try moving
                // this call to the onSwipe functions themselves
                setTimeout(() => {
                  onSwipeRight();
                  this.scrollView.current.scrollToOffset({
                    offset: 0,
                    animated: false,
                  });
                });
                console.log("Post Swipe Right");
              }
            }
          }}
          ref={this.scrollView}
          initialScrollIndex={0}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              this.scrollView.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          data={this.props?.contents[this.state?.index]}
          keyExtractor={(item, index) => `${item.PageNr}-${index}`}
          renderItem={({ item, index }) => {
            const { PaperNr, PaperSec, PaperPar, Content, LineNr } = item;
            const fill = Content.length;
            // console.log(PaperNr, PaperSec, PaperPar, fill, PaperNr + PaperSec + PaperPar * fill);
            let foundParagraph = false;
            if (
              PaperNr === SearchPaperNr &&
              PaperSec === SearchPaperSec &&
              PaperPar === SearchPaperPar
            ) {
              foundParagraph = true;
            }
            return (
              <ContentView
                content={item}
                key={LineNr}
                parentIndex={this.state.index}
                index={index}
                searchText={searchText}
                foundParagraph={foundParagraph}
                jumpToParagraph={this.jumpToParagraphIndex}
              />
            );
          }}
        />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { contents, compareContents, contentLineNumbers } = state.book;
  const { bookmarks } = state.bookmark;
  const { referenceNumber, moreSpace, nightMode } = state.setting;
  const { localization } = state;
  return {
    contents,
    contentLineNumbers,
    compareContents,
    bookmarks,
    referenceNumber,
    moreSpace,
    nightMode,
    localization,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addBookmark,
      removeBookmark,
      getContents,
      getCompareContents,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(Content);
