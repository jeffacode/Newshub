import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { injectIntl } from 'components/IntlContext';
import { connect } from 'react-redux';
import Auth from 'utils/Auth';
import { signup } from 'redux/modules/app/action';
import { getError } from 'redux/modules/app/reducer';
import { Input, Icon, Button } from 'antd';
import logo from 'assets/logo.png';
import './style.scss';

class Signup extends Component {
  state = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  onInputChange = (e, key) => {
    this.setState({ [key]: e.target.value });
  }

  signup = () => {
    const { signup } = this.props;
    const {
      email, username, password, confirmPassword,
    } = this.state;
    signup(email, username, password, confirmPassword);
  }

  updateLocale = (locale) => {
    const { intl } = this.props;
    intl.updateLocale(locale);
    Auth.storeLocale(locale);
  }

  renderSignupPanel = () => {
    const { error: { errors }, intl } = this.props;
    const {
      email, username, password, confirmPassword,
    } = this.state;
    return (
      <div className="signup__signupPanel">
        <div className="signup__appInfo">
          <img className="signup__appLogo" src={logo} alt="logo" />
        </div>
        <div className="signup__appDesc">
          {intl.formatMessage({ id: 'appDesc' })}
        </div>
        <div className="signup__signupInput">
          <Input
            style={{ height: 40, marginBottom: 24 }}
            placeholder={intl.formatMessage({ id: 'emailInput_placeholder' })}
            type="email"
            prefix={<Icon type="mail" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
            value={email}
            onChange={e => this.onInputChange(e, 'email')}
            onPressEnter={this.signup}
          />
          {(errors && errors.email) && (
            <div className="signup__signupInput--error">
              {errors.email}
            </div>
          )}
        </div>
        <div className="signup__signupInput">
          <Input
            style={{ height: 40, marginBottom: 24 }}
            placeholder={intl.formatMessage({ id: 'usernameInput_placeholder' })}
            type="text"
            prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
            value={username}
            onChange={e => this.onInputChange(e, 'username')}
            onPressEnter={this.signup}
          />
          {(errors && errors.username) && (
            <div className="signup__signupInput--error">
              {errors.username}
            </div>
          )}
        </div>
        <div className="signup__signupInput">
          <Input
            style={{ height: 40, marginBottom: 24 }}
            placeholder={intl.formatMessage({ id: 'passwordInput_placeholder' })}
            type="password"
            prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
            value={password}
            onChange={e => this.onInputChange(e, 'password')}
            onPressEnter={this.signup}
          />
          {(errors && errors.password) && (
            <div className="signup__signupInput--error">
              {errors.password}
            </div>
          )}
        </div>
        <div className="signup__signupInput">
          <Input
            style={{ height: 40, marginBottom: 24 }}
            placeholder={intl.formatMessage({ id: 'confirmPasswordInput_placeholder' })}
            type="password"
            prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
            value={confirmPassword}
            onChange={e => this.onInputChange(e, 'confirmPassword')}
            onPressEnter={this.signup}
          />
          {(errors && errors.confirmPassword) && (
            <div className="signup__signupInput--error">
              {errors.confirmPassword}
            </div>
          )}
        </div>
        <Button
          className="signup__signupBtn"
          type="primary"
          onClick={this.signup}
        >
          {intl.formatMessage({ id: 'signup' })}
        </Button>
      </div>
    );
  }

  renderIntlSwitch = () => {
    const { intl } = this.props;
    return (
      <div className="signup__intlSwitch">
        <span
          className={classnames({
            signup__intlItem: true,
            'signup__intlItem--active': intl.locale === 'en-us',
          })}
          onClick={() => this.updateLocale('en-us')}
          role="presentation"
        >
          English
        </span>
        <span className="signup__intlSwitchSeparator">
          |
        </span>
        <span
          className={classnames({
            signup__intlItem: true,
            'signup__intlItem--active': intl.locale === 'zh-cn',
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
      <div className="signup">
        {this.renderSignupPanel()}
        {this.renderIntlSwitch()}
      </div>
    );
  }
}

Signup.propTypes = {
  error: PropTypes.object.isRequired,
  signup: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  error: getError(state),
});

const mapDispatchToProps = {
  signup,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Signup));
