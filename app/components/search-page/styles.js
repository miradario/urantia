import { DEFAULT_FONT, DEFAULT_FONT_ITALIC } from '../constants';

export default {
  searchPtag: {
    fontFamily: DEFAULT_FONT,
    textAlign: 'left',
    margin: 0,
  },
  cancelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    // marginRight: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#000',
    color: '#FFF',
  },
  em: {
    fontFamily: DEFAULT_FONT_ITALIC,
    fontStyle: 'normal',
  },
};
