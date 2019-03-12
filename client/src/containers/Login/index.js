import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { injectIntl } from 'components/IntlContext';
import { connect } from 'react-redux';
import Locale from 'utils/Locale';
import { login } from 'redux/modules/app/action';
import { getError } from 'redux/modules/app/reducer';
import { Input, Icon, Button } from 'antd';
import logo from 'assets/logo.png';
import './style.scss';

class Login extends Component {
  state = {
    email: '',
    password: '',
  };

  onInputChange = (e, key) => {
    this.setState({ [key]: e.target.value });
  }

  login = () => {
    const { login } = this.props;
    const { email, password } = this.state;
    login(email, password);
  }

  updateLocale = (locale) => {
    const { intl } = this.props;
    intl.updateLocale(locale);
    Locale.storeLocale(locale);
  }

  renderLoginPanel = () => {
    const { error: { errors }, intl } = this.props;
    const { email, password } = this.state;
    return (
      <div className="login__loginPanel">
        <div className="login__appInfo">
          <img className="login__appLogo" src={logo} alt="logo" />
        </div>
        <div className="login__appDesc">
          {intl.formatMessage({ id: 'appDesc' })}
        </div>
        <div className="login__loginInput">
          <Input
            style={{ height: 40, marginBottom: 24 }}
            placeholder={intl.formatMessage({ id: 'emailInput_placeholder' })}
            type="email"
            prefix={<Icon type="mail" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
            value={email}
            onChange={e => this.onInputChange(e, 'email')}
            onPressEnter={this.login}
          />
          {(errors && errors.email) && (
            <div className="login__loginInput--error">
              {errors.email}
            </div>
          )}
        </div>
        <div className="login__loginInput">
          <Input
            style={{ height: 40, marginBottom: 24 }}
            placeholder={intl.formatMessage({ id: 'passwordInput_placeholder' })}
            type="password"
            prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
            value={password}
            onChange={e => this.onInputChange(e, 'password')}
            onPressEnter={this.login}
          />
          {(errors && errors.password) && (
            <div className="login__loginInput--error">
              {errors.password}
            </div>
          )}
        </div>
        <Button
          className="login__loginBtn"
          type="primary"
          onClick={this.login}
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

  render() {
    return (
      <div className="login">
        {this.renderLoginPanel()}
        {this.renderIntlSwitch()}
      </div>
    );
  }
}

Login.propTypes = {
  error: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  error: getError(state),
});

const mapDispatchToProps = {
  login,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login));
