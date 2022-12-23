import { DEFAULT_FONT, DEFAULT_FONT_ITALIC, DEFAULT_FONT_BOLD } from '../constants';

const fontFamily = {
  fontFamily: DEFAULT_FONT,
};

export default {
  p: {
    ...fontFamily,
    textAlign: 'left',
  },
  span: {
    ...fontFamily,
    color: '#718093',
  },
  em: {
    fontFamily: DEFAULT_FONT_ITALIC,
    fontStyle: 'normal',
  },
  title: {
    fontFamily: DEFAULT_FONT_BOLD,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
};
