import React, { Component } from 'react';
import { Text, TouchableOpacity, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { ListItem } from 'react-native-elements';
import styles from '../styles';
import { clearBookmarks } from '../../controllers/actions';
import { COMP_TYPES, ROUTER_TYPES } from '../../routers/types';
import { bindActionCreators } from 'redux';
import { CONCRETE, DARK_GREY } from '../color';
import RenderItem from '../shared/render-item';

class Bookmark extends Component {
  renderItem = ({ item: bookmark, index }) => {
    const { PaperNr, PaperSec, PageNr, LineNr } = bookmark;
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
          this.props.navigation.navigate(COMP_TYPES.CONTENT_MORE, {
            PageNr,
            PaperNr,
            PaperSec,
            LineNr,
            revert: true,
            fromBookmark: true,
            fromHistory: false,
            shouldUpdate: true,
          });
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
                {this.props.localization.bookmark}
              </ListItem.Title>
            </ListItem.Content>
            <TouchableOpacity
              style={styles.clearBtn}
              activeOpacity={0.5}
              onPress={() => this.props.clearBookmarks()}>
              <Text style={styles.clearText}>
                {this.props.localization.clearAll}
              </Text>
            </TouchableOpacity>
          </ListItem>
        }
        style={{ backgroundColor }}
        data={this.props.bookmarks}
        renderItem={this.renderItem}
        stickyHeaderIndices={[0]}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

function mapStateToProps(state) {
  const { sections } = state.book;
  const { bookmarks } = state.bookmark;
  const { fontSize, nightMode } = state.setting;
  const { localization } = state;
  return {
    bookmarks,
    sections,
    fontSize,
    nightMode,
    localization,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clearBookmarks,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(Bookmark);
