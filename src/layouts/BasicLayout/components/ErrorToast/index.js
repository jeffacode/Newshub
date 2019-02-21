import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import './style.scss';

class ErrorToast extends Component {
  componentDidMount() {
    const { onDismiss, timeout } = this.props;
    this.timer = setTimeout(onDismiss, timeout);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { errorMsg } = this.props;

    return (
      <div className="errorToast">
        <div className="errorToast__content">
          <Icon className="errorToast__close" theme="filled" type="close-circle" />
          <span className="errorToast__text ml-5">{errorMsg}</span>
        </div>
      </div>
    );
  }
}

ErrorToast.propTypes = {
  errorMsg: PropTypes.string.isRequired,
  timeout: PropTypes.number.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default ErrorToast;
