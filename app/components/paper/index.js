import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import { COMP_TYPES } from '../../routers/types';
import { bindActionCreators } from 'redux';
import { getPapers, getComparePapers } from '../../controllers/actions';
import RenderItem from '../shared/render-item';
import BackButton from '../shared/back-button';
import styles from '../styles';
import { CONCRETE, DARK_GREY, WHITE } from '../color';
import { AfterInteractions } from 'react-native-interactions';

class Paper extends Component {
  state = { romanNumbers: ['I', 'II', 'III', 'IV'] };
  componentDidMount() {
    this.props.navigation.addListener('focus', () => console.info('focus paper'));
    const { revert, partNo } = this.props.route.params;
    const title = `${this.props.localization.part} ${this.state.romanNumbers[partNo]}`;
    this.props.navigation.setOptions({
      title,
    });
    if (revert) {
      this.setBackButton();
    }
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

  componentDidUpdate(prevProps) {
       if (prevProps.route.params.partNo != this.props.route.params.partNo) {
           let title = `${this.props.localization.part} ${this.state.romanNumbers[this.props.route.params.partNo]}`;
           this.setHeaderTitle(title)
       }
    if (prevProps.nightMode !== this.props.nightMode) {
      this.setNightMode();
    }
  }

  shouldComponentUpdate(nextProps) {
      console.log("paper shouldComponentUpdate()")
      console.log("Paper Next Prop", this.props.route.params, nextProps.route.params);
      if (this.props.route.params.partNo != nextProps.route.params.partNo) {
          return true;
      }
    const { fontSize, nightMode } = this.props;
    return nextProps.nightMode !== nightMode || nextProps.fontSize !== fontSize;
  }

  setHeaderTitle = (title) => {
    this.props.navigation.setOptions({
      title,
    });
  };

  setBackButton = (partNo) => {
    this.props.navigation.setOptions({
      headerLeft: (props) => {
        return (
          <BackButton
            name="Parts"
            navigate={this.props.navigation.navigate}
            routeName={COMP_TYPES.BOOK}
          />
        );
      },
    });
  };

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      const { index } = viewableItems[0];
      const title = `${this.props.localization.part} ${this.state.romanNumbers[index]}`;
      this.setHeaderTitle(title);
    }
  };

  renderItem = ({ item: paper, index }) => {
    const { partNo: parentIndex } = this.props.route.params;
    const { PaperNr: paperNo, Content } = paper;
    let title = `${this.props.localization.paper} ${paperNo}`;
    let subtitle = Content;
    if (paperNo === 0) {
      title = Content;
      subtitle = undefined;
    }
    let compareTitle;
    let compareSubtitle;
    const { comparePapers } = this.props;
    if (comparePapers.length > 0) {
      title = paperNo;
      compareTitle = ` - ${subtitle}`;
      subtitle = comparePapers[parentIndex][index]['Content'];
      compareSubtitle = undefined;
      if (paperNo === 0) {
        title = Content;
        compareTitle = undefined;
      }
    }
    return (
      <RenderItem
        style={{ fontSize: this.props.fontSize }}
        nightMode={this.props.nightMode}
        index={index}
        title={title}
        subtitle={subtitle}
        compareTitle={compareTitle}
        compareSubtitle={compareSubtitle}
        navigate={() => {
          this.props.navigation.push(COMP_TYPES.SECTION, {
            paperNo,
          });
        }}
      />
    );
  };

  render() {
    const { partNo } = this.props.route.params;
    const backgroundColor = this.props.nightMode ? DARK_GREY : CONCRETE;
    const parentIndex = partNo;
    const data = this.props.papers[parentIndex];

    const keyExtractor = (_, index) => index.toString();
    return (
      <AfterInteractions placeholder={<View></View>}>
        <FlatList
          key={parentIndex}
          initialNumToRender={25}
          maxToRenderPerBatch={25}
          // legacyImplementation={false}
          // removeClippedSubviews={true}
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
  const { papers, comparePapers } = state.book;
  const { fontSize, nightMode } = state.setting;
  const { localization } = state;
  return {
    papers,
    comparePapers,
    fontSize,
    nightMode,
    localization,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPapers,
      getComparePapers,
    },
    dispatch,
  );
}
export default connect(mapStateToProps, matchDispatchToProps)(Paper);
