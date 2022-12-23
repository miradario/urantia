import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import BookPage from '../components/book-page';
import MorePage from '../components/more-page';
import { COMP_TYPES, ROUTER_TYPES } from './types';
import Paper from '../components/paper';
import Section from '../components/section';
import Content from '../components/content';
import Setting from '../components/setting';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Icon as RnIcon } from 'react-native-elements';
import Language from '../components/setting/language';
import LaunchScreen from '../components/launch-screen';
import styles from '../components/styles';
import { DODGER_BLUE, GEYSER, WHITE } from '../components/color';
import compareLanguage from '../components/setting/compare-language';
import Styling from '../components/setting/styling';
import { connect } from 'react-redux';
import SearchPage from '../components/search-page';
import LanguageSetup from '../components/language-setup';
import LanguageDownloadSetup from '../components/language-setup/language-download-setup';
import LanguageDefaultSetup from '../components/language-setup/language-default-setup';
import LanguageDownload from '../components/language-download';
import LanguageManage from '../components/language-manage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BackButton = (goBack, displayName) => {
  return (
    <TouchableOpacity
      style={styles.backButton}
      activeOpacity={0.4}
      onPress={() => goBack()}>
      <Icon
        name="navigate-before"
        size={25}
        color={DODGER_BLUE}
        style={{ marginRight: -5 }}
      />
      <Text style={styles.backText}>{displayName}</Text>
    </TouchableOpacity>
  );
};

const Stack = createStackNavigator();

const SearchStack = createStackNavigator();

const SearchIcon = (navigate, param) => {
  return (
    <RnIcon
      reverse
      raised
      size={12}
      name="search"
      type="ionicon"
      color={DODGER_BLUE}
      reverseColor="#FFF"
      onPress={() => navigate(param)}
    />
  );
};

const BookPageRouter = (props) => {
  const { localization } = props.route.params;
  return (
    <Stack.Navigator initialRouteName={COMP_TYPES.BOOK}>
      <Stack.Screen
        name={ROUTER_TYPES.SEARCH_PAGE}
        component={SearchRouter}
        initialParams={{ localization }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={COMP_TYPES.UPDATE_AREA}
        component={LanguageManage}
        options={({ navigation }) => ({
          title: localization.manageLanguages,
          headerTitleAlign: 'center',
          headerLeft: () =>
            BackButton(navigation.goBack, localization.book),
        })}
      />
      <Stack.Screen
        name={COMP_TYPES.BOOK}
        component={BookPage}
        options={{
          // headerTitle: () => mainHeaderTitle(),
          title: localization.title,
          headerTitleStyle: { ...styles.mainHeaderTitle },
          headerLeft: () => {
            return <Text></Text>;
          },
          headerRight: () => {
            return SearchIcon(
              props.navigation.navigate,
              ROUTER_TYPES.SEARCH_PAGE,
            );
          },
        }}
        listeners={() => ({
          transitionEnd: async () => await AsyncStorage.removeItem('@save_state')
        })}
      />
      <Stack.Screen
        name={COMP_TYPES.PAPER}
        component={Paper}
        options={({ navigation }) => ({
          title: '',
          headerTitleAlign: 'center',
          headerLeft: () => BackButton(navigation.goBack, localization.parts),
          headerRight: () => {
            return SearchIcon(
              props.navigation.navigate,
              ROUTER_TYPES.SEARCH_PAGE,
            );
          },
        })}
      />
      <Stack.Screen
        name={COMP_TYPES.SECTION}
        component={Section}
        options={({ navigation }) => ({
          title: '',
          headerTitleAlign: 'center',
          headerLeft: () => BackButton(navigation.goBack, localization.papers),
          headerRight: () => {
            return SearchIcon(
              props.navigation.navigate,
              ROUTER_TYPES.SEARCH_PAGE,
            );
          },
        })}
      />
      <Stack.Screen
        name={COMP_TYPES.CONTENT}
        component={Content}
        options={({ navigation }) => ({
          title: '',
          headerTitleAlign: 'center',
          // headerShown: false,
          headerLeft: () =>
            BackButton(navigation.goBack, localization.sections),
        })}
      />
    </Stack.Navigator>
  );
};

const SearchRouter = (props) => {
  const { localization } = props.route.params;
  return (
    <SearchStack.Navigator mode="modal">
      <SearchStack.Screen
        name={COMP_TYPES.SEARCH}
        component={SearchPage}
        options={({ navigation }) => ({
          headerLeft: null,
          headerRight: () => {
            return (
              <RnIcon
                reverse
                size={10}
                name="close-sharp"
                type="ionicon"
                color={DODGER_BLUE}
                // style={{ paddingHorizontal: 0, width: 40, height: 40 }}
                reverseColor="#FFF"
                onPress={() => {
                  navigation.goBack();
                }}
              />
            );
          },
          // headerStyle: {
          //   backgroundColor: DODGER_BLUE,
          // },
        })}
      />
      <SearchStack.Screen
        name={COMP_TYPES.CONTENT}
        component={Content}
        options={({ navigation }) => ({
          headerLeft: () => BackButton(navigation.goBack, localization.search),
        })}
      />
    </SearchStack.Navigator>
  );
};

const MorePageRouter = (props) => {
  const { localization } = props.route.params;
  return (
    <Stack.Navigator initialRouteName={COMP_TYPES.MORE}>
      <Stack.Screen
        name={COMP_TYPES.MORE}
        component={MorePage}
        options={({ navigation }) => ({
          title: localization.title,
          headerTitleAlign: 'center',
          headerTitleStyle: { ...styles.mainHeaderTitle },
          headerLeft: null,
        })}
        listeners={() => ({
          transitionEnd: async () => await AsyncStorage.removeItem('@save_state')
        })}
      />
      <Stack.Screen
        name={COMP_TYPES.CONTENT_MORE}
        component={Content}
        options={({ navigation }) => ({
          title: localization.title,
          headerTitleAlign: 'center',
          headerTitleStyle: { ...styles.mainHeaderTitle },
          headerLeft: null,
        })}
      />
      <Stack.Screen
        name={COMP_TYPES.SETTING}
        component={Setting}
        options={({ navigation }) => ({
          title: localization.settings,
          headerTitleAlign: 'center',
          headerLeft: () => BackButton(navigation.goBack, localization.more),
        })}
      />
      <Stack.Screen
        name={COMP_TYPES.STYLING}
        component={Styling}
        options={({ navigation }) => ({
          title: localization.textSize,
          headerTitleAlign: 'center',
          headerLeft: () =>
            BackButton(navigation.goBack, localization.settings),
        })}
      />
      <Stack.Screen
        name={COMP_TYPES.LANGUAGE}
        component={Language}
        options={({ navigation }) => ({
          title: localization.language,
          headerTitleAlign: 'center',
          headerLeft: () =>
            BackButton(navigation.goBack, localization.settings),
        })}
      />
      <Stack.Screen
        name={COMP_TYPES.COMPARE_LANGUAGE}
        component={compareLanguage}
        options={({ navigation }) => ({
          title: localization.compareLanguage,
          headerTitleAlign: 'center',
          headerLeft: () =>
            BackButton(navigation.goBack, localization.settings),
        })}
      />
      <Stack.Screen
        name={COMP_TYPES.LANGUAGE_DOWNLOAD}
        component={LanguageDownload}
        options={({ navigation }) => ({
          title: '',
          headerTitleAlign: 'center',
          headerLeft: () =>
            BackButton(navigation.goBack, localization.manageLanguages),
        })}
      />
      <Stack.Screen
        name={COMP_TYPES.LANGUAGE_MANAGE}
        component={LanguageManage}
        options={({ navigation }) => ({
          title: localization.manageLanguages,
          headerTitleAlign: 'center',
          headerLeft: () =>
            BackButton(navigation.goBack, localization.settings),
        })}
      />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const MainRouter = (props) => {
  const { localization } = props.route.params;
  return (
    <Tab.Navigator
      initialRouteName={ROUTER_TYPES.BOOK_PAGE}
      tabBarOptions={{
        activeBackgroundColor: DODGER_BLUE,
        inactiveBackgroundColor: DODGER_BLUE,
        activeTintColor: WHITE,
        inactiveTintColor: GEYSER,
      }}
      backBehavior="none">
      <Tab.Screen
        name={ROUTER_TYPES.BOOK_PAGE}
        component={BookPageRouter}
        initialParams={{ localization }}
        options={{
          title: localization.book,
          tabBarIcon: ({ color }) => {
            return <Icon name="library-books" color={color} size={25} />;
          },
        }}
      />
      <Tab.Screen
        name={ROUTER_TYPES.MORE_PAGE}
        component={MorePageRouter}
        initialParams={{ localization }}
        options={{
          title: localization.more,
          tabBarIcon: ({ color }) => {
            return <Icon name="more-horiz" color={color} size={25} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

function Router({ localization }) {
  // const navigation = useNavigation();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={COMP_TYPES.LAUNCH_PAGE}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name={COMP_TYPES.LAUNCH_PAGE}
          component={LaunchScreen}
          initialParams={{ isFromSetupPage: false }}
        />
        <Stack.Screen
          name={COMP_TYPES.WAITING_AREA}
          component={LaunchScreen}
          initialParams={{ isFromSetupPage: false }}
        />
        <Stack.Screen
          name={ROUTER_TYPES.MAIN_PAGE}
          component={MainRouter}
          initialParams={{ localization }}
        />
        <Stack.Screen
          name={COMP_TYPES.LANGUAGE_SETUP}
          component={LanguageSetup}
          initialParams={{ localization }}
        />
        <Stack.Screen
          name={COMP_TYPES.LANGUAGE_DOWNLOAD_SETUP}
          component={LanguageDownloadSetup}
          initialParams={{ localization }}
        />
        <Stack.Screen
          name={COMP_TYPES.LANGUAGE_DEFAULT_SETUP}
          component={LanguageDefaultSetup}
          initialParams={{ localization }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function mapStateToProps(state) {
  const { localization } = state;
  return {
    localization,
  };
}

export default connect(mapStateToProps, null)(Router);
