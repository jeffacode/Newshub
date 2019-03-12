import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'components/IntlContext';
import {
  getIsLogin,
  getError,
  getUser,
  getNotices,
  getSubscriptions,
  getNavigatorBarContent,
} from 'redux/modules/app/reducer';
import {
  clearError,
  logout,
  deleteNotice,
  unsubscribe,
} from 'redux/modules/app/action';
import isEmpty from 'lodash/isEmpty';
import AppSider from './components/AppSider';
import AppHeader from './components/AppHeader';
import ErrorToast from './components/ErrorToast';
import './style.scss';

class AppLayout extends Component {
  render() {
    const {
      isLogin,
      error,
      user,
      notices,
      subscriptions,
      navigatorBarContent,
      location: { pathname, search },
      clearError,
      logout,
      deleteNotice,
      unsubscribe,
      intl,
      history,
      children,
    } = this.props;

    return (
      <div className="appLayout">
        <div className="appLayout__sider">
          <AppSider
            isLogin={isLogin}
            user={user}
            logout={logout}
            intl={intl}
            url={pathname}
            history={history}
          />
        </div>
        <div className="appLayout__main">
          {
            isLogin && (
              <div className="appLayout__header">
                <AppHeader
                  isLogin={isLogin}
                  user={user}
                  notices={notices}
                  subscriptions={subscriptions}
                  navigatorBarContent={navigatorBarContent}
                  searchQuery={search}
                  deleteNotice={deleteNotice}
                  unsubscribe={unsubscribe}
                  intl={intl}
                  history={history}
                />
              </div>
            )
          }
          <div className="appLayout__content">
            {children}
          </div>
        </div>
        {!isEmpty(error) && (
          <ErrorToast
            error={error}
            timeout={2000}
            onDismiss={clearError}
            intl={intl}
          />
        )}
      </div>
    );
  }
}

AppLayout.propTypes = {
  // 通过connect传入
  error: PropTypes.object.isRequired,
  isLogin: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  notices: PropTypes.array.isRequired,
  clearError: PropTypes.func.isRequired,
  subscriptions: PropTypes.array.isRequired,
  navigatorBarContent: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  deleteNotice: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  // 通过injectIntl传入
  intl: PropTypes.object.isRequired,
  // 通过props传入
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  error: getError(state),
  isLogin: getIsLogin(state),
  user: getUser(state),
  notices: getNotices(state),
  subscriptions: getSubscriptions(state),
  navigatorBarContent: getNavigatorBarContent(state),
  location: state.router.location,
});

const mapDispatchToProps = {
  clearError,
  logout,
  deleteNotice,
  unsubscribe,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppLayout));
