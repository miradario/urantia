/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './app/controllers/reducers';
import Router from './app/routers';
import { enableScreens } from 'react-native-screens';
enableScreens();

const store = createStore(reducers, applyMiddleware(thunk));
export const App = () => {
  // SettingService.removeLanguages();
  // FileService.checkUpdates();
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};
