import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DODGER_BLUE } from '../color';
import styles from '../styles';

const BackButton = (props) => {
  const { name, navigate, params, routeName } = props;
  return (
    <TouchableOpacity
      style={styles.backButton}
      activeOpacity={0.4}
      onPress={() => {
        navigate(routeName, params);
      }}>
      <Icon name="navigate-before" size={30} color={DODGER_BLUE} />
      <Text style={styles.backText}>{name}</Text>
    </TouchableOpacity>
  );
};

export default BackButton;
