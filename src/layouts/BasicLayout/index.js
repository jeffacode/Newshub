import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'components/IntlContext';
import { matchRoutes } from 'react-router-config';
import head from 'lodash/head';
import { combineRoutes } from 'containers/app/config/routes';
import {
  getIsLogin,
  getErrorMsg,
  getUser,
  getNotices,
  getIsFetchingNotices,
} from 'redux/modules/app/reducer';
import {
  clearErrorMsg,
  logout,
  deleteNotice,
} from 'redux/modules/app/action';
import AppSider from './components/AppSider';
import AppHeader from './components/AppHeader';
import PageHeader from './components/PageHeader';
import AppFooter from './components/AppFooter';
import ErrorToast from './components/ErrorToast';
import './style.scss';


class BasicLayout extends Component {
  componentDidMount() {
    const { isLogin, history } = this.props;
    if (!isLogin) {
      history.push('/login');
    }
  }

  componentDidUpdate() {
    const { isLogin, history } = this.props;
    if (!isLogin) {
      history.push('/login');
    }
  }

  render() {
    const {
      errorMsg,
      user,
      notices,
      isFetchingNotices,
      clearErrorMsg,
      logout,
      deleteNotice,
      intl,
      location,
      children,
    } = this.props;

    const { pathname } = location; // 当前URL
    const { route } = head((matchRoutes(combineRoutes, pathname))); // 匹配到的路由项

    return (
      <div className="basicLayout">
        <div className="basicLayout__sider">
          <AppSider
            intl={intl}
            url={pathname}
          />
        </div>
        <div className="basicLayout__content">
          <AppHeader
            user={user}
            notices={notices}
            isFetching={isFetchingNotices}
            logout={logout}
            deleteNotice={deleteNotice}
            intl={intl}
          />
          <PageHeader
            route={route}
            intl={intl}
          />
          <div className="basicLayout__mainContent">
            {children}
          </div>
          <AppFooter />
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
  }
}

BasicLayout.propTypes = {
  // 通过connect传入
  isLogin: PropTypes.bool.isRequired,
  errorMsg: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  notices: PropTypes.array.isRequired,
  isFetchingNotices: PropTypes.bool.isRequired,
  clearErrorMsg: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  deleteNotice: PropTypes.func.isRequired,
  // 通过injectIntl传入
  intl: PropTypes.object.isRequired,
  // AclRouter组件会把 match、location、history 等路由信息直接传给布局组件
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isLogin: getIsLogin(state),
  errorMsg: getErrorMsg(state),
  user: getUser(state),
  notices: getNotices(state),
  isFetchingNotices: getIsFetchingNotices(state),
});

const mapDispatchToProps = {
  clearErrorMsg,
  logout,
  deleteNotice,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(BasicLayout));
