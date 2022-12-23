import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import { COMP_TYPES } from '../../routers/types';
import styles from '../styles';
import { bindActionCreators } from 'redux';
import {
  getSections,
  getCompareSections,
  addHistory,
} from '../../controllers/actions';
import RenderItem from '../shared/render-item';
import BackButton from '../shared/back-button';
import { CONCRETE, DARK_GREY, WHITE } from '../color';
import { AfterInteractions } from 'react-native-interactions';

class Section extends Component {
  componentDidMount() {
    const { paperNo, revert } = this.props.route.params;
    // console.log("Section Index: ", paperNo, revert);
    const { PaperNr, PartNr } = this.props.sections[paperNo][0];
    const { paper, parts } = this.props.localization;
    let title = `${paper} ${PaperNr}`;
    if (PaperNr === 0) {
      title = this.props.localization.forward;
      this.props.navigation.setOptions({
          headerLeft: (props) => {
              return (
                  <BackButton
                  name={parts}
                  navigate={this.props.navigation.navigate}
                  routeName={COMP_TYPES.BOOK}
                  />
              );
          },
      });
    }
    if (revert) {
      this.props.navigation.setOptions({
        headerLeft: (props) => {
          return (
            <BackButton
              name={paper}
              navigate={this.props.navigation.navigate}
              routeName={COMP_TYPES.PAPER}
              params={{
                partNo: PartNr - 1,
                revert: true,
              }}
            />
          );
        },
      });
    }

    this.props.navigation.setOptions({
      title,
    });
    this.setNightMode();
  }

  componentDidUpdate(prevProps) {
    // console.log("Sections Prev Prop", prevProps.route.params, this.props.route.params);
    if (prevProps.route.params.paperNo != this.props.route.params.paperNo) {
        var paperNo = this.props.route.params.paperNo
        // console.log("Section Data: ", this.props.sections[paperNo][0]);
        const { PaperNr, PartNr } = this.props.sections[paperNo][0];
        const { paper } = this.props.localization;
        let title = `${paper} ${PaperNr}`;
        if (PaperNr === 0) {
          title = this.props.localization.forward;
        }
        let partNo = PartNr - 1
        this.setHeaderTitle(title)
        this.setBackButton(partNo)
        this.props.route.params["partNo"] = PartNr
    }
    if (prevProps.nightMode !== this.props.nightMode) {
      this.setNightMode();
    }
  }

  shouldComponentUpdate(nextProps) {
    // console.log("Sections Next Prop", this.props.route.params, nextProps.route.params);
    if (this.props.route.params.paperNo != nextProps.route.params.paperNo) {
        return true;
    }
    const { fontSize, nightMode } = this.props;
    return nextProps.nightMode !== nightMode || nextProps.fontSize !== fontSize;
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

  setBackButton = (partNo) => {
    // console.log("My Part No is: ", { partNo });
    const { papers, parts } = this.props.localization;
    if (partNo < 0) {
        this.props.navigation.setOptions({
            headerLeft: (props) => {
                return (
                    <BackButton
                    name={parts}
                    navigate={this.props.navigation.navigate}
                    routeName={COMP_TYPES.BOOK}
                    />
                );
            },
        });
    } else {
        this.props.navigation.setOptions({
            headerLeft: (props) => {
                return (
                    <BackButton
                    name={papers}
                    navigate={this.props.navigation.navigate}
                    routeName={COMP_TYPES.PAPER}
                    params={{
                        partNo,
                        revert: true,
                    }}
                    />
                );
            },
        });
    }
  };

  setHeaderTitle = (title) => {
    this.props.navigation.setOptions({
      title,
    });
  };

  renderItem = ({ item: section, index }) => {
    const { paperNo: parentIndex } = this.props.route.params;
    let { Content: title, PageNr, PaperNr, PaperSec, LineNr } = section;
    let subtitle = undefined;
    title = title.replace(/<br*.\/>/g, ' - ');
    const { compareSections } = this.props;
    if (compareSections.length > 0) {
      subtitle = compareSections[parentIndex][index]['Content'].replace(
        /<br*.\/>/g,
        ' - ',
      );
    }
    return (
      <RenderItem
        style={{ fontSize: this.props.fontSize }}
        nightMode={this.props.nightMode}
        index={index}
        title={title}
        subtitle={subtitle}
        fromPage={COMP_TYPES.SECTION}
        navigate={() => {
          this.props.addHistory({ PageNr, PaperNr, PaperSec, LineNr });
          this.props.navigation.navigate(COMP_TYPES.CONTENT, {
            PageNr,
            PaperNr,
            PaperSec,
            LineNr,
            fromHistory: false,
            fromBookmark: false
          });
        }}
      />
    );
  };

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      const { PartNr, PaperNr } = viewableItems[0]['item'][0];
      let title = `${this.props.localization.paper} ${PaperNr}`;
      if (PaperNr === 0) {
        title = viewableItems[0]['item'][0]['Content'];
      }
      this.setHeaderTitle(title);
        if (this.props.route.params.revert) {
            this.setBackButton(PartNr);
        }
    }
  };

  render() {
    const { paperNo, revert } = this.props.route.params;
    const backgroundColor = this.props.nightMode ? DARK_GREY : CONCRETE;
    const parentIndex = paperNo;
    const data = this.props.sections[paperNo];
    const keyExtractor = (_, index) => index.toString();
    return (
      <AfterInteractions placeholder={<View></View>}>
        <FlatList
          initialNumToRender={5}
          legacyImplementation={false}
          style={{ backgroundColor }}
          data={data}
          renderItem={this.renderItem}
          keyExtractor={keyExtractor}
        />
      </AfterInteractions>
    );
  }
}

function mapStateToProps(state) {
  const { sections, compareSections } = state.book;
  const { fontSize, nightMode } = state.setting;
  const { localization } = state;
  return {
    sections,
    compareSections,
    fontSize,
    nightMode,
    localization,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSections,
      getCompareSections,
      addHistory,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(Section);
