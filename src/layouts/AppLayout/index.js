import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'components/IntlContext';
import {
  getIsLogin,
  getErrorMsg,
  getUser,
  getNotices,
  getSubscriptions,
  getSelectedView,
  getNavigatorBarContent,
} from 'redux/modules/app/reducer';
import {
  clearErrorMsg,
  logout,
  deleteNotice,
  unsubscribe,
  selectView,
} from 'redux/modules/app/action';
import AppSider from './components/AppSider';
import AppHeader from './components/AppHeader';
import ErrorToast from './components/ErrorToast';
import './style.scss';

const AppLayout = ({
  isLogin,
  errorMsg,
  user,
  notices,
  subscriptions,
  selectedView,
  navigatorBarContent,
  clearErrorMsg,
  logout,
  deleteNotice,
  unsubscribe,
  selectView,
  intl,
  location,
  history,
  children,
}) => {
  const { pathname } = location; // 当前URL

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
        <div className="appLayout__header">
          <AppHeader
            isLogin={isLogin}
            user={user}
            notices={notices}
            subscriptions={subscriptions}
            selectedView={selectedView}
            navigatorBarContent={navigatorBarContent}
            deleteNotice={deleteNotice}
            unsubscribe={unsubscribe}
            selectView={selectView}
            intl={intl}
            history={history}
          />
        </div>
        <div className="appLayout__content">
          {children}
        </div>
      </div>
      {errorMsg && (
        <ErrorToast
          errorMsg={intl.formatMessage({ id: errorMsg })}
          timeout={2000}
          onDismiss={clearErrorMsg}
        />
      )}
    </div>
  );
};

AppLayout.propTypes = {
  // 通过connect传入
  isLogin: PropTypes.bool.isRequired,
  errorMsg: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  notices: PropTypes.array.isRequired,
  clearErrorMsg: PropTypes.func.isRequired,
  subscriptions: PropTypes.array.isRequired,
  selectedView: PropTypes.object.isRequired,
  navigatorBarContent: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  deleteNotice: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  selectView: PropTypes.func.isRequired,
  // 通过injectIntl传入
  intl: PropTypes.object.isRequired,
  // 通过props传递
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isLogin: getIsLogin(state),
  errorMsg: getErrorMsg(state),
  user: getUser(state),
  notices: getNotices(state),
  subscriptions: getSubscriptions(state),
  selectedView: getSelectedView(state),
  navigatorBarContent: getNavigatorBarContent(state),
});

const mapDispatchToProps = {
  clearErrorMsg,
  logout,
  deleteNotice,
  unsubscribe,
  selectView,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppLayout));
