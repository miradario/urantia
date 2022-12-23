import React, { Component } from 'react';
import { View, Modal, BackHandler } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import UText from '../shared/u-text';
import { DARK_GREY, DODGER_BLUE, SHAMROCK, WHITE } from '../color';
import SettingService from '../../services/setting-service';
import styles from '../styles';
import CONFIG from '../../../config.json';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { setLocalization } from '../../controllers/actions';
import { bindActionCreators } from 'redux';
import { COMP_TYPES } from '../../routers/types';

const ENV = CONFIG['ENV'];

class LanguageDefaultSetup extends Component {
  constructor(props) {
    super(props);
    const { defaultLanguage, downloadedLanguages } = props.route.params;
    let marginVertical = 30;
    this.state = {
      showPicker: false,
      defaultLanguage,
      downloadedLanguages,
      langObject: downloadedLanguages.reduce(
        (obj, item) => ((obj[item.Prefix] = item.NativeName), obj),
        {},
      ),
      marginVertical,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
          console.log("hardwareBackPress")
      }
    );
  }

  async setDefaultLanguage(defaultLanguage) {
    try {
      await SettingService.setLanguage(defaultLanguage);
      this.props.setLocalization({ prefix: defaultLanguage });
      this.setState({
        defaultLanguage,
        showPicker: false,
      });
    } catch (error) {
      console.log({ error });
    }
  }

  render() {
    const { localization } = this.props;
    return (
      <View
        style={{
          margin: '10%',
          width: '80%',
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <View style={{ borderRadius: 5, padding: 20, backgroundColor: '#FFF' }}>
          <UText style={{ fontSize: 15, marginBottom: 10 }}>
            {localization.defaultLanguage}
          </UText>
          <ListItem
            onPress={() => {
              this.setState({
                showPicker: true,
              });
            }}>
            <ListItem.Content>
              <ListItem.Title>
                <UText style={{ fontSize: 15 }}>
                  {this.state.langObject[this.state.defaultLanguage]}
                </UText>
              </ListItem.Title>
            </ListItem.Content>
            <Icon name="arrow-drop-down" size={22} color={DARK_GREY} />
          </ListItem>
          {/* <Picker
              selectedValue={this.state.defaultLanguage}
              onValueChange={(defaultLanguage, itemIndex) => {
                this.setDefaultLanguage(defaultLanguage);
              }}>
              {this.state.downloadedLanguages.map((language, index) => {
                return (
                  <Picker.Item
                    key={index}
                    label={language.NativeName}
                    value={language.Prefix}
                  />
                );
              })}
            </Picker> */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.showPicker}>
            <View
              style={{
                flex: 1,
                marginHorizontal: '10%',
                marginVertical: `10%`,
                borderRadius: 10,
                backgroundColor: WHITE,
                padding: 20,
              }}>
              <UText style={{ fontSize: 20, marginBottom: 10 }}>
                {localization.defaultLanguage}
              </UText>
              <ScrollView>
                {this.state.downloadedLanguages.map((language, index) => {
                  return (
                    <ListItem
                      key = {language.Prefix}
                      onPress={() => {
                        this.setDefaultLanguage(language.Prefix);
                      }}
                      bottomDivider>
                      <ListItem.Content>
                        <ListItem.Title>
                          <UText style={{ fontSize: 15, color: '#000' }}>
                            {language.NativeName}
                          </UText>
                        </ListItem.Title>
                      </ListItem.Content>
                      {this.state.defaultLanguage === language.Prefix && (
                        <Icon name="check-circle" size={18} color={SHAMROCK} />
                      )}
                    </ListItem>
                  );
                })}
              </ScrollView>
            </View>
          </Modal>
        </View>
        <Button
          title={localization.next}
          titleStyle={[styles.uText]}
          buttonStyle={{ backgroundColor: DODGER_BLUE }}
          containerStyle={{
            marginTop: 15,
          }}
          onPress={() => {
            this.props.navigation.navigate(COMP_TYPES.WAITING_AREA, {
              isFromSetupPage: true,
              welcomeMsg: localization.welcomeMsg,
            });
          }}
        />
      </View>
    );
  }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        setLocalization,
      },
      dispatch,
    );
  }

function mapStateToProps(state) {
  const { localization } = state;
  return {
    localization,
  };
}

export default connect(mapStateToProps, matchDispatchToProps)(LanguageDefaultSetup);
