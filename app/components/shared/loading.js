import React, { Component } from 'react';
// import { ActivityIndicator } from 'react-native';
import { Text, View, Modal, ActivityIndicator } from 'react-native';
import styles from '../styles';

const Loading = (props) => {
  return (
    <Modal transparent={true} animationType="fade" visible={props.visible}>
      <View style={styles.loadingOuter}>
        <View style={styles.loadingInner}>
          <ActivityIndicator size="small" color="#dff9fb" />
          <Text style={styles.loadingText}>{props.msg}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loading;
