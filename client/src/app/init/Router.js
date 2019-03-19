import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import map from 'lodash/map';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { IntlProvider } from 'components/IntlContext';
import { getIsLogin } from 'redux/modules/app/reducer';
import AppLayout from 'layouts/AppLayout';
import Locale from 'utils/Locale';
import appConfig from '../config/appConfig';
import { unauthorizedRoutes, authorizedRoutes } from '../config/routes';

class Router extends Component {
  createRedirectRoute = ({ path, redirect }) => (
    <Route
      exact
      path={path}
      key={path}
      render={() => <Redirect to={redirect} />}
    />
  )

  createNormalRoute = ({ path, component }) => (
    <Route
      exact
      path={path}
      key={path}
      component={component}
    />
  )

  createUnauthorizedRoute = (route) => {
    const { isLogin } = this.props;
    const { path, component, redirect } = route;
    if (component || redirect) {
      if (!component && redirect) {
        return this.createRedirectRoute(route);
      }
      if (component && !redirect) {
        return this.createNormalRoute(route);
      }
      if (isLogin) {
        return this.createRedirectRoute(route); // 已登录的时候跳转
      }
      return this.createNormalRoute(route); // 未登录的时候渲染component
    }
    throw new Error(`Something wrong with your route configuration for PATH = ${path}.`);
  }

  createAuthorizedRoute = (route) => {
    const { isLogin } = this.props;
    const { path, component, redirect } = route;
    if (component || redirect) {
      if (!component && redirect) {
        return this.createRedirectRoute(route);
      }
      if (component && !redirect) {
        return this.createNormalRoute(route);
      }
      if (isLogin) {
        return this.createNormalRoute(route); // 登录的时候渲染component
      }
      return this.createRedirectRoute(route); // 未登录的时候跳转
    }
    throw new Error(`Something wrong with your route configuration for PATH = ${path}.`);
  }

  createNotFoundRoute = () => (
    <Route
      render={() => <Redirect to="/404" />}
    />
  )

  render() {
    const { history } = this.props;
    // 从本地存储中取出locale，这一步必须在react生命周期里完成
    const locale = Locale.getLocale();
    const { localeMap } = appConfig;

    return (
      <ConnectedRouter history={history}>
        <IntlProvider
          defaultLocale={locale}
          localeMap={localeMap}
        >
          <AppLayout history={history}>
            <Switch>
              {map(
                unauthorizedRoutes,
                route => this.createUnauthorizedRoute(route),
              )}
              {map(
                authorizedRoutes,
                route => this.createAuthorizedRoute(route),
              )}
              {this.createNotFoundRoute()}
            </Switch>
          </AppLayout>
        </IntlProvider>
      </ConnectedRouter>
    );
  }
}

Router.propTypes = {
  history: PropTypes.object.isRequired,
  isLogin: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLogin: getIsLogin(state),
});

export default connect(mapStateToProps)(Router);
