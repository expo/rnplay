/**
 * @providesModule AboutScreen
 * @flow
 */

import React from 'react';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { connect } from 'react-redux';

import Actions from 'Actions';
import Colors from 'Colors';
import {
  BoldText,
  RegularText,
} from 'StyledText';
import Router from 'Router';

@connect()
class SettingsButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginRight: 15}}
        onPress={() => this.props.dispatch(Actions.signOut())}>
        <RegularText style={{color: '#fff'}}>Sign Out</RegularText>
      </TouchableOpacity>
    );
  }
}

export default class AboutScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'About',
      renderRight() {
        if (Platform.OS === 'ios') {
          return <SettingsButton />;
        }
      },
    }
  };

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        automaticallyAdjustContentInsets={false}>
        <RegularText style={styles.heading}>
          React Native Playground
        </RegularText>

        <Image
          style={styles.logo}
          source={require('../assets/images/logo-with-sand.png')}
        />

        <BoldText style={styles.title}>
          Run React Native experiences from rnplay.org directly on your device
        </BoldText>

        <RegularText style={styles.text}>
          You can write code on rnplay.org in your browser and view it directly on your device using this app!
        </RegularText>

        <BoldText style={styles.title}>
          What does target mean?
        </BoldText>
        <RegularText style={styles.text}>
          This refers to the React Native version that the app was created for.
          As of 0.31.0, this app will automatically load the native
          dependencies for the target version so your app will continue working
          even when React Native Playground updates!
        </RegularText>

        <BoldText style={styles.title}>
          Powered by the Exponent client
        </BoldText>
        <RegularText style={styles.text}>
          In addition to making your playground experiences compatible with
          future releases of this app, Exponent provides a wide range of native
          APIs like Video and Svg. <RegularText onPress={this._openExponentDocs} style={styles.linkText}>Read the docs for Exponent here.</RegularText>
        </RegularText>

        <RegularText style={styles.otherQuestionsText}>
          Questions? Please get in touch: <RegularText onPress={this._onPressEmail} style={styles.linkText}>info@rnplay.org</RegularText>
        </RegularText>
      </ScrollView>
    );
  }

  _onPressEmail = () => {
    Linking.openURL('mailto:info@rnplay.org');
  };

  _openExponentDocs = () => {
    Linking.openURL('https://docs.getexponent.com');
  };
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  sendEmailText: {
    fontSize: 13,
    color: Colors.tintColor,
  },
  link: {
    color: Colors.tintColor,
  },
  emphasis: {
    fontStyle: 'italic',
  },
  logo: {
    height: 150,
    width: 150,
    marginBottom: 10,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: Colors.darkGrey,
    marginBottom: 10,
  },
  text: {
    fontSize: 13,
    color: Colors.midGrey,
    marginBottom: 20,
  },
  otherQuestionsText: {
    fontSize: 13,
  },
  linkText: {
    color: Colors.tintColor,
  },
});
