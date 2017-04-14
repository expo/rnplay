/**
 * @providesModule StyledTextInput
 * @flow
 */

import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

type State = {
  isFocused: boolean,
};

export default class StyledTextInput extends React.Component {
  _textInput: TextInput;

  state: State = {
    isFocused: false,
  };

  render() {
    const { isFocused } = this.state;
    const placeholderTextColor = isFocused ? '#bca1cf' : '#a678c8';
    const borderBottomColor = isFocused ? '#fff' : '#a678c8';

    return (
      <View style={[styles.textInputWrapper, { borderBottomColor }]}>
        <TextInput
          placeholderTextColor={placeholderTextColor}
          underlineColorAndroid="transparent"
          ref={view => {
            this._textInput = view;
          }}
          {...this.props}
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          style={[styles.textInput, this.props.style]}
        />
      </View>
    );
  }

  focus() {
    this._textInput && this._textInput.focus();
  }

  blur() {
    this._textInput && this._textInput.blur();
  }

  _onFocus = () => {
    this.setState({ isFocused: true });
    this.props.onFocus && this.props.onFocus();
  };

  _onBlur = () => {
    this.setState({ isFocused: false });
    this.props.onBlur && this.props.onBlur();
  };
}

const styles = StyleSheet.create({
  textInputWrapper: {
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  textInput: {
    fontWeight: '300',
    backgroundColor: 'transparent',
    paddingLeft: 2,
    fontSize: 18,
    color: '#fff',
    height: 40,
  },
});
