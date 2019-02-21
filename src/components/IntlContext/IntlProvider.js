import React, { Component } from 'react';
import PropTypes from 'prop-types';
import replaceVariables from './utils/replaceVariables';
import { Provider } from './IntlContext';

class IntlProvider extends Component {
  constructor(props) {
    super(props);

    const { defaultLocale } = props;

    this.state = {
      locale: defaultLocale, // locale是需要内部维护的状态
    };
  }

  // 用于获取内容
  formatMessage = (config, variables) => {
    const { localeMap } = this.props;
    const { locale } = this.state;
    const { id, defaultMessage } = config;

    let message = localeMap[locale][id];

    if (message === undefined) {
      if (defaultMessage !== undefined) {
        return defaultMessage; // 如果没有找到message但有defaultMessage就用defaultMessage
      }

      throw new Error(`[react-intl-context]: Message key ${id} is undefined. Fallback to empty string.`);
    }

    if (variables !== undefined) {
      message = replaceVariables(message, variables); // 用variables中的字段替代message中的变量
    }

    return message;
  };

  // 用于切换语言
  updateLocale = (locale) => {
    this.setState({
      locale,
    });
  }

  render() {
    const { children } = this.props;
    const { locale } = this.state;
    const value = {
      locale,
      formatMessage: this.formatMessage,
      updateLocale: this.updateLocale,
    };

    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}

IntlProvider.propTypes = {
  defaultLocale: PropTypes.string.isRequired,
  localeMap: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
  children: PropTypes.element.isRequired,
};

IntlProvider.defaultProps = {
  localeMap: {},
};

export default IntlProvider;
