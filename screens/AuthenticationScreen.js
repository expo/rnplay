/**
 * @providesModule AuthenticationScreen
 * @flow
 */

import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import TouchableNativeFeedbackSafe
  from '@exponent/react-native-touchable-native-feedback-safe';

import Actions from 'Actions';
import Alerts from 'Alerts';
import AuthenticationApi from 'AuthenticationApi';
import Colors from 'Colors';
import KeyboardEventListener from 'KeyboardEventListener';
import LocalStorage from 'LocalStorage';
import PlaygroundStore from 'PlaygroundStore';
import StyledTextInput from 'StyledTextInput';
import isValidEmail from 'isValidEmail';
import { Components } from 'exponent';
import { RegularText } from 'StyledText';
import { connect } from 'react-redux';

type State = {
  email: ?string,
  password: ?string,
  isRequestInFlight: boolean,
  keyboardHeight: number,
};

@connect()
export default class AuthenticationScreen extends React.Component {
  _unsubscribe: ?() => void;
  _passwordInput: ?StyledTextInput;

  static route = {
    navigationBar: {
      visible: false,
    },
  };

  state: State = {
    email: null,
    password: null,
    isRequestInFlight: false,
    keyboardHeight: 0,
  };

  componentWillMount() {
    this._unsubscribe = KeyboardEventListener.subscribe(
      this._onKeyboardVisibilityChange
    );
  }

  componentWillUnmount() {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
  }

  render() {
    return (
      <Components.LinearGradient
        style={{ flex: 1 }}
        colors={['#8E0AC2', Colors.tintColor]}>
        <ScrollView
          onScroll={this._blurFocusedTextInput}
          scrollEventThrottle={32}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>

          <View style={{ flex: 1, alignItems: 'center' }}>
            {this._maybeRenderLogo()}

            <View>
              <StyledTextInput
                autoCorrect={false}
                autoCapitalize="none"
                blurOnSubmit={false}
                onChangeText={value => {
                  this.setState({ email: value.trim() });
                }}
                onSubmitEditing={this._handleSubmitEmail}
                value={this.state.email}
                keyboardType="email-address"
                placeholder="Email"
              />

              <StyledTextInput
                ref={view => {
                  this._passwordInput = view;
                }}
                onChangeText={value => {
                  this.setState({ password: value.trim() });
                }}
                onSubmitEditing={this._handleSignInAsync}
                blurOnSubmit={false}
                value={this.state.password}
                secureTextEntry
                placeholder="Password"
              />

              {this._renderSignInButton()}

              <Text style={styles.suggestionText}>
                You probably want to sign in to easily open apps from the browser. If you don’t have an account, we’ll create one with the given email and password automatically.
              </Text>
            </View>
          </View>

          {this._maybeRenderAnonymousSignInButton()}
        </ScrollView>
      </Components.LinearGradient>
    );
  }

  _maybeRenderLogo() {
    if (this._isKeyboardOpen()) {
      return;
    }

    return (
      <Image
        source={require('../assets/images/logo-white.png')}
        style={styles.logoImage}
      />
    );
  }

  _maybeRenderAnonymousSignInButton() {
    if (this._isKeyboardOpen()) {
      return;
    }

    return (
      <TouchableOpacity
        hitSlop={{ top: 15, left: 15, right: 15, bottom: 15 }}
        style={styles.anonymousEntryContainer}
        onPress={this._handleAnonymousEntry}>
        <RegularText style={styles.anonymousEntryText}>
          No thanks, let me in anonymously
        </RegularText>
      </TouchableOpacity>
    );
  }

  _renderSignInButton() {
    let { isRequestInFlight } = this.state;
    let loadingIndicator;
    if (isRequestInFlight) {
      loadingIndicator = (
        <View style={styles.loadingIndicatorContainer}>
          <ActivityIndicator size="small" color={Colors.midGrey} />
        </View>
      );
    }

    return (
      <View style={{ marginTop: 10 }}>
        <TouchableNativeFeedbackSafe
          background={TouchableNativeFeedbackSafe.Ripple()}
          delayPressIn={0}
          onPress={this._handleSignInAsync}
          style={styles.signInButton}>
          <RegularText style={styles.signInText}>
            Sign in
            {' '}
            <RegularText style={styles.registerText}>(or register)</RegularText>
          </RegularText>
        </TouchableNativeFeedbackSafe>
        {loadingIndicator}
      </View>
    );
  }

  _handleSubmitEmail = () => {
    this._passwordInput && this._passwordInput.focus();
  };

  _handleSignInAsync = async () => {
    let { isRequestInFlight, email, password } = this.state;

    if (isRequestInFlight) {
      return;
    } else if (!email || !password) {
      return;
    } else if (!isValidEmail(email)) {
      this.props.navigator.showLocalAlert(
        'Please enter a valid email address',
        Alerts.error
      );
      return;
    }

    try {
      this.setState({ isRequestInFlight: true });
      let result = await AuthenticationApi.signIn(email, password);

      if (result.error) {
        let isEmailTaken = await AuthenticationApi.isEmailTaken(email);

        if (isEmailTaken) {
          this.props.navigator.showLocalAlert(
            'Oops, your password seems to be incorrect',
            Alerts.error
          );
        } else {
          this._promptForRegistration();
        }
      } else {
        this._handleSuccessfulLoginAsync(result);
      }
    } catch (e) {
      console.log({ e });
      this.props.navigator.showLocalAlert(
        'Something went wrong! Please try again',
        Alerts.error
      );
    } finally {
      this.setState({ isRequestInFlight: false });
    }
  };

  _promptForRegistration = () => {
    if (!this.state.email) {
      return;
    }

    Alert.alert(
      'Account registration',
      `There is no account matching ${this.state.email}, would you like to register it?`,
      [
        { text: 'Register the account', onPress: this._registerAccountAsync },
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      ]
    );
  };

  _registerAccountAsync = async () => {
    let { email, password } = this.state;

    if (!email || !password) {
      return;
    }

    let result = await AuthenticationApi.signUp(email, password);
    this._handleSuccessfulLoginAsync(result);
  };

  _handleSuccessfulLoginAsync = async (result: Object) => {
    this._blurFocusedTextInput();
    this.props.navigator.hideLocalAlert();
    this.props.dispatch(Actions.signIn(result));
  };

  _handleAnonymousEntry = async () => {
    this.props.navigator.hideLocalAlert();
    this.props.dispatch(Actions.signIn({ isGuest: true }));
  };

  _blurFocusedTextInput = () => {
    TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField());
  };

  _isKeyboardOpen() {
    return this.state.keyboardHeight > 0;
  }

  _onKeyboardVisibilityChange = ({
    keyboardHeight,
    layoutAnimationConfig,
  }: { keyboardHeight: number, layoutAnimationConfig: ?Object }) => {
    if (keyboardHeight === 0) {
      this._blurFocusedTextInput();
    }

    if (layoutAnimationConfig) {
      LayoutAnimation.configureNext(layoutAnimationConfig);
    }

    this.setState({ keyboardHeight });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  logoImage: {
    width: 198 / 2.0,
    height: 271 / 2.0,
    marginBottom: 30,
  },
  anonymousEntryContainer: {
    paddingTop: 35,
  },
  anonymousEntryText: {
    color: '#f7f5f5',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  signInButton: {
    paddingVertical: 20,
    borderRadius: 2,
    backgroundColor: '#f7f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicatorContainer: {
    position: 'absolute',
    right: 20,
    paddingTop: 2,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: {
    backgroundColor: 'transparent',
    fontSize: 18,
    color: Colors.tintColor,
  },
  registerText: {
    backgroundColor: 'transparent',
    color: '#bca1cf',
  },
  suggestionText: {
    fontSize: 15,
    color: '#bca1cf',
    marginTop: 18,
    fontStyle: 'italic',
    opacity: 0.8,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    paddingTop: 70,
    paddingHorizontal: 40,
  },
});
