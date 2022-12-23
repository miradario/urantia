import { Alert } from 'react-native';

const Message = (props) => {
  const { title, subtitle } = props;
  Alert.alert(title, subtitle, [
    {
      text: 'OK',
      cancelable: true,
    },
  ]);
};

export default Message;
