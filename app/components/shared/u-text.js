import React from 'react';
import { Text } from 'react-native';
import styles from '../styles';

const UText = (props) => {
  return (
    <Text style={{ ...styles.uText, ...props.style }} selectable>
      {props.children}
    </Text>
  );
};

export default UText;
