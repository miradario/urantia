import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ListItem } from 'react-native-elements';
import styles from '../styles';
import { COMP_TYPES, ROUTER_TYPES } from '../../routers/types';
import { clearHistory } from '../../controllers/actions';
import { CONCRETE, DARK_GREY } from '../color';
import RenderItem from '../shared/render-item';

class History extends Component {
  renderItem = ({ item: history, index }) => {
    const { PaperNr, PaperSec, PageNr, LineNr } = history;
    const subtitle = this.props.sections[PaperNr][PaperSec]['Content'].replace(
      /<br*.\/>/g,
      ' - ',
    );
    const title =
      PaperNr === 0
        ? this.props.sections[0][0]['Content']
        : `${this.props.localization.paper} - ${PaperNr}`;
    return (
      <RenderItem
        style={{ fontSize: this.props.fontSize }}
        nightMode={this.props.nightMode}
        index={index}
        title={title}
        subtitle={subtitle}
        navigate={() => {
          this.props.navigation.navigate( COMP_TYPES.CONTENT_MORE,
            {
              PageNr,
              PaperNr,
              PaperSec,
              LineNr,
              fromHistory: true,
              fromBookmark: false,
              revert: true,
            },
          );
        }}
      />
    );
  };

  render() {
    const backgroundColor = this.props.nightMode ? DARK_GREY : CONCRETE;

    return (
      <FlatList
        ListHeaderComponent={
          <ListItem
            containerStyle={{
              backgroundColor: '#2f3640',
              paddingVertical: 10,
            }}
            bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={styles.listHeaderTitle}>
                {this.props.localization.history}
              </ListItem.Title>
            </ListItem.Content>
            <TouchableOpacity
              style={styles.clearBtn}
              activeOpacity={0.5}
              onPress={() => this.props.clearHistory()}>
              <Text style={styles.clearText}>
                {this.props.localization.clearAll}
              </Text>
            </TouchableOpacity>
          </ListItem>
        }
        style={{ backgroundColor }}
        data={this.props.histories}
        renderItem={this.renderItem}
        stickyHeaderIndices={[0]}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

function mapStateToProps(state) {
  const { histories } = state.history;
  const { sections } = state.book;
  const { fontSize, nightMode } = state.setting;
  const { localization } = state;
  return {
    histories,
    sections,
    fontSize,
    nightMode,
    localization,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clearHistory,
    },
    dispatch,
  );
}
export default connect(mapStateToProps, matchDispatchToProps)(History);
