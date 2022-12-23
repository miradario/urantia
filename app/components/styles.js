import { StyleSheet } from 'react-native';
import { PORCELAIN, WHITE, DODGER_BLUE } from './color';
import settingsStyle from './setting/styles';
import contentStyle from './content/styles';
import routerStyle from '../routers/styles';
// import searchStyle from '../search-page/styles';
import searchStyle from './search-page/styles';
import { DEFAULT_FONT } from './constants';

export default StyleSheet.create({
  ...routerStyle,
  ...settingsStyle,
  ...contentStyle,
  ...searchStyle,
  uText: {
    fontFamily: DEFAULT_FONT,
  },

  headerTitle: {
    fontSize: 14,
    fontFamily: DEFAULT_FONT,
    textAlign: 'center',
  },

  swiperiew: {
    flex: 1,
  },
  launchView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PORCELAIN,
  },
  morePage: {
    flex: 1,
  },
  listHeaderTitle: {
    color: WHITE,
    fontSize: 14,
    fontFamily: DEFAULT_FONT,
  },
  clearBtn: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: WHITE,
  },
  clearText: {
    fontFamily: DEFAULT_FONT,
    fontSize: 12,
    lineHeight: 15,
  },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    color: DODGER_BLUE,
    fontFamily: DEFAULT_FONT,
  },
  loadingOuter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 52, 54, 0.6)',
  },

  loadingInner: {
    backgroundColor: '#2d3436',
    borderRadius: 5,
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    // flex: 1,
  },

  loadingText: {
    fontFamily: DEFAULT_FONT,
    color: '#dff9fb',
    marginLeft: 5,
  },
});
