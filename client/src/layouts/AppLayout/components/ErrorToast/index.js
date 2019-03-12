import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import './style.scss';

const asyncTypeToMsg = {
  FETCH: 'fetch_failed', // 获取数据失败
  POST: 'post_failed', // 发送数据失败
  PATCH: 'patch_failed', // 更改数据失败
  DELETE: 'delete_failed', // 删除数据失败
};

class ErrorToast extends Component {
  componentDidMount() {
    const { onDismiss, timeout } = this.props;
    this.timer = setTimeout(onDismiss, timeout);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { error: { message }, intl } = this.props;
    const errorMsg = asyncTypeToMsg[message]
      ? intl.formatMessage({ id: asyncTypeToMsg[message] })
      : message;

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
  error: PropTypes.object.isRequired,
  timeout: PropTypes.number.isRequired,
  onDismiss: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default ErrorToast;
