import {
  DODGER_BLUE,
} from '../components/color';
import { DEFAULT_FONT, DEFAULT_FONT_BOLD } from '../components/constants';
export default {
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    color: DODGER_BLUE,
  },
  mainHeaderTitle: {
    fontSize: 16,
    fontFamily: DEFAULT_FONT_BOLD,
    textAlign: 'center',
    color: '#353b48',
  },

  headerTitle: {
    fontSize: 15,
    fontFamily: DEFAULT_FONT,
    textAlign: 'center',
    color: '#353b48',
  },
  settingBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginRight: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  settingTxt: {
    fontSize: 13,
    marginLeft: 1,
    lineHeight: 16,
    padding: 0,
  },
};
