import React from 'react';
import { Switch } from 'react-native';
import { SHAMROCK } from '../color';

export default (props) => {
  return (
    <Switch
      trackColor={{ false: '#767577', true: SHAMROCK }}
      thumbColor={props.isEnabled ? '#fff' : '#fff'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={(value) => props.toggleSwitch(value)}
      value={props.isEnabled}
    />
  );
};
