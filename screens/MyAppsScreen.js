/**
 * @providesModule MyAppsScreen
 * @flow
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import TouchableNativeFeedbackSafe
  from '@exponent/react-native-touchable-native-feedback-safe';

import { connect } from 'react-redux';

import Actions from 'Actions';
import RemoteAppListView from 'RemoteAppListView';
import Colors from 'Colors';
import { RegularText, BoldText } from 'StyledText';
import Router from 'Router';

@connect(data => MyAppsScreen.getDataProps)
export default class MyAppsScreen extends React.Component {
  static getDataProps(data) {
    return {
      currentUser: data.currentUser,
    };
  }

  static route = {
    navigationBar: {
      title: 'My Apps',
    },
  };

  render() {
    if (this.props.currentUser.isGuest) {
      return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <BoldText style={styles.title}>
            Hello, guest!
          </BoldText>

          <RegularText style={styles.description}>
            You haven’t signed in yet, so as far as we know you don’t have any apps!
          </RegularText>

          <TouchableNativeFeedbackSafe
            style={styles.button}
            onPress={this._handleReturnToSignInPress}>
            <RegularText style={styles.buttonText}>
              Go back to sign in
            </RegularText>
          </TouchableNativeFeedbackSafe>
        </ScrollView>
      );
    } else {
      return <RemoteAppListView url="/apps.json" hideCreator />;
    }
  }

  _handleReturnToSignInPress = async () => {
    this.props.dispatch(Actions.signOut());
  };
}

const marginHorizontal = 25;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    marginHorizontal,
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 15,
  },
  description: {
    color: '#939292',
    marginHorizontal,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 35,
  },
  button: {
    backgroundColor: Colors.tintColor,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginHorizontal: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
  },
});
