import { ListItem } from 'react-native-elements';
import styles from '../styles';
import React, { Component } from 'react';
import UText from './u-text';
import { DARK_GREY, WHISPER, WHITE } from '../color';
import { DEFAULT_FONT_BOLD } from '../constants';
import { COMP_TYPES } from '../../routers/types';

const RenderItem = (props) => {
  const {
    index,
    title,
    subtitle,
    compareTitle,
    compareSubtitle,
    fromPage,
    navigate,
  } = props;
  const backgroundColor = props.nightMode ? DARK_GREY : WHISPER;
  const uTextStyle = props.nightMode
    ? { ...props.style, color: WHITE }
    : { ...props.style, color: DARK_GREY };
  const additionalSty =
    fromPage === COMP_TYPES.SECTION && index === 0
      ? { fontFamily: DEFAULT_FONT_BOLD }
      : {};
  return (
    <ListItem
      key={index}
      containerStyle={{ backgroundColor, paddingVertical: subtitle ? 12 : 16 }}
      onPress={() => navigate()}
      bottomDivider>
      <ListItem.Content>
        <ListItem.Title>
          <UText style={{ ...uTextStyle, ...additionalSty }}>
            {title} {compareTitle}
          </UText>
        </ListItem.Title>
        {subtitle ? (
          <ListItem.Subtitle>
            <UText style={uTextStyle}>{subtitle}</UText>
          </ListItem.Subtitle>
        ) : null}
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
};

export default RenderItem;
