import React, { Component, ReactNode } from 'react';
import {
  Text,
  Platform,
  View,
  Dimensions,
  Modal,
  Animated,
  ScrollView,
} from 'react-native';

import Message from './Message';
import Button from './Button';
import CancelButton from './CancelButton';

import { defaultStyles, hairlineWidth } from './styles';
import { Callback } from '../../tsCommon/baseTypes';

const MAX_HEIGHT = Dimensions.get('window').height * 0.7;

const pick = (source, props) =>
  props.reduce((res, key) => {
    res[key] = source[key];
    return res;
  }, {});

interface Component {
  component: ReactNode;
  height: number;
}

export interface Props {
  message: string;
  title: string | ReactNode;
  options: Array<string | Component>;
  destructiveButtonIndex: number;

  tintColor: string;
  warnColor: string;
  buttonUnderlayColor: string;

  titleHeight: number;
  messageHeight: number;
  buttonHeight: number;
  cancelMargin: number;

  styles: any;
  onPress: Callback<any>;
}
export default class ActionSheet extends Component<Props> {
  static defaultProps = {
    tintColor: '#007aff',
    warnColor: '#ff3b30',
    buttonUnderlayColor: '#ebebeb',

    titleHeight: 40,
    messageHeight: 50,
    buttonHeight: 58 + hairlineWidth,
    cancelMargin: Platform.select({
      ios: 10,
      android: 6,
    }),

    styles: defaultStyles,
    onPress: () => { },
  };
  scrollEnabled = false;
  translateY = this.calculateHeight(this.props);

  state = {
    visible: false,
    sheetPositionY: new Animated.Value(this.translateY),
  };

  componentDidMount() {
    this.translateY = this.calculateHeight(this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    this.translateY = this.calculateHeight(this.props);
  }

  show() {
    this.setState({ visible: true });
    this.showSheet();
  }

  hide = index => {
    this.hideSheet(() => {
      this.setState({ visible: false });
      this.props.onPress(index);
    });
  };

  cancel = () => this.hideSheet(() => this.setState({ visible: false }));

  showSheet() {
    Animated.timing(this.state.sheetPositionY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }

  hideSheet(callback) {
    Animated.timing(this.state.sheetPositionY, {
      toValue: this.translateY,
      duration: 150,
      useNativeDriver: true,
    }).start(callback);
  }

  calculateHeight(props) {
    const {
      options,
      buttonHeight,
      titleHeight,
      messageHeight,
      cancelMargin,
    } = props;

    let height = options.reduce(
      (sum, { height: optionHeight = buttonHeight }) => (sum += optionHeight),
      cancelMargin,
    );
    // for cancel button.
    height += buttonHeight;

    if (props.title) height += titleHeight;
    if (props.message) height += messageHeight;

    if (height > MAX_HEIGHT) {
      this.scrollEnabled = true;
      return MAX_HEIGHT;
    } else {
      this.scrollEnabled = false;
      return height;
    }
  }

  noBorderStyles = {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  };

  renderOptions(styles) {
    const {
      options,
      tintColor,
      warnColor,
      destructiveButtonIndex,
      buttonHeight,
      buttonUnderlayColor,
    } = this.props;

    return options.map((option, index) => {
      const fontColor =
        destructiveButtonIndex === index ? warnColor : tintColor;

      return <Button key={`button_${index}`}
        {...{
          option,
          styles,
          index,
          fontColor,
          buttonHeight,
          buttonUnderlayColor,
          onPress: this.hide,
        }} />
    });
  }

  render() {
    const {
      styles: userStyles,
      message,
      messageHeight,
      title,
      titleHeight,
    } = this.props;

    const { visible, sheetPositionY } = this.state;
    const styles = Object.assign({}, userStyles, defaultStyles);

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="none"
        onRequestClose={this.cancel}
      >
        <View style={styles.wrapper}>
          <Text style={styles.overlay} onPress={this.cancel} />
          <Animated.View
            style={[
              styles.backdrop,
              {
                height: this.translateY,
                transform: [{ translateY: sheetPositionY }],
              },
            ]}
          >
            {title && (
              <Message
                text={title}
                titleStyle={styles.titleText}
                style={[styles.title, { height: titleHeight }]}
              />
            )}

            {message && (
              <Message
                text={message}
                titleStyle={styles.messageText}
                style={[
                  styles.message,
                  { height: messageHeight },
                  title && this.noBorderStyles,
                ]}
              />
            )}

            <ScrollView
              scrollEnabled={this.scrollEnabled}
              style={[
                styles.optionsContainer,
                (title || message) && this.noBorderStyles,
              ]}
              contentContainerStyle={styles.options}
            >
              {this.renderOptions(styles)}
            </ScrollView>

            <CancelButton
              styles={styles}
              onPress={this.cancel}
              {...pick(this.props, [
                'options',
                'tintColor',
                'cancelMargin',
                'buttonHeight',
                'buttonUnderlayColor',
              ])}
            />
          </Animated.View>
        </View>
      </Modal>
    );
  }
}