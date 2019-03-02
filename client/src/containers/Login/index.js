import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { injectIntl } from 'components/IntlContext';
import { connect } from 'react-redux';
import Cookie from 'js-cookie';
import {
  Input, Icon, Button,
} from 'antd';
import { login, clearLoginErrorMsg } from 'redux/modules/app/action';
import { getIsLogin, getLoginErrorMsg } from 'redux/modules/app/reducer';
import logo from 'assets/logo.png';
import './style.scss';

class Login extends Component {
  state = {
    username: '',
    password: '',
  };

  onInputChange = (e, key) => {
    this.setState({ [key]: e.target.value });
  }

  handleLogin = () => {
    const { login } = this.props;
    const { username, password } = this.state;
    login(username, password);
  }

  updateLocale = (locale) => {
    const { intl } = this.props;
    intl.updateLocale(locale);
    Cookie.set('locale', locale); // 同时更新cookie中的locale字段
  }

  renderLoginPanel = () => {
    const { intl } = this.props;
    const { username, password } = this.state;
    return (
      <div className="login__loginPanel">
        <div className="login__appInfo">
          <img className="login__appLogo" src={logo} alt="logo" />
        </div>
        <div className="login__appDesc">
          {intl.formatMessage({ id: 'login_appDesc' })}
        </div>
        <Input
          className="login__loginInput"
          style={{ height: 40, marginBottom: 24 }}
          placeholder={intl.formatMessage({ id: 'login_usernameInput_placeholder' })}
          type="text"
          prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
          value={username}
          onChange={e => this.onInputChange(e, 'username')}
          onPressEnter={this.handleLogin}
        />
        <Input
          className="login__loginInput"
          placeholder={intl.formatMessage({ id: 'login_passwordInput_placeholder' })}
          type="password"
          prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
          value={password}
          onChange={e => this.onInputChange(e, 'password')}
          onPressEnter={this.handleLogin}
        />
        <Button
          className="login__loginBtn"
          type="primary"
          onClick={this.handleLogin}
        >
          {intl.formatMessage({ id: 'login' })}
        </Button>
      </div>
    );
  }

  renderIntlSwitch = () => {
    const { intl } = this.props;
    return (
      <div className="login__intlSwitch">
        <span
          className={classnames({
            login__intlItem: true,
            'login__intlItem--active': intl.locale === 'en-us',
          })}
          onClick={() => this.updateLocale('en-us')}
          role="presentation"
        >
          English
        </span>
        <span className="login__intlSwitchSeparator">
          |
        </span>
        <span
          className={classnames({
            login__intlItem: true,
            'login__intlItem--active': intl.locale === 'zh-cn',
          })}
          onClick={() => this.updateLocale('zh-cn')}
          role="presentation"
        >
          中文
        </span>
      </div>
    );
  }

  renderLoginErrorMsg = () => {
    const { loginErrorMsg, clearLoginErrorMsg, intl } = this.props;
    if (loginErrorMsg) {
      const timer = setTimeout(() => {
        clearLoginErrorMsg();
        clearTimeout(timer);
      }, 1000);

      return (
        <div className="login__errorMsg">
          {intl.formatMessage({ id: loginErrorMsg })}
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="login">
        {this.renderLoginPanel()}
        {this.renderIntlSwitch()}
        {this.renderLoginErrorMsg()}
      </div>
    );
  }
}

Login.propTypes = {
  loginErrorMsg: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired,
  clearLoginErrorMsg: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isLogin: getIsLogin(state),
  loginErrorMsg: getLoginErrorMsg(state),
});

const mapDispatchToProps = {
  login,
  clearLoginErrorMsg,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login));
