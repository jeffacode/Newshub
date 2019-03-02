import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Cookie from 'js-cookie';
import map from 'lodash/map';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { IntlProvider } from 'components/IntlContext';
import { getIsLogin } from 'redux/modules/app/reducer';
import AppLayout from 'layouts/AppLayout';
import NotFound from 'layouts/NotFound';
import appConfig from '../config/appConfig';
import { unauthorizedRoutes, authorizedRoutes } from '../config/routes';

const locale = Cookie.get('locale'); // 从cookie中取出locale
const { localeMap } = appConfig;

class Router extends Component {
  createRedirectRoute = (route) => {
    const { path, redirect } = route;

    return (
      <Route
        key={path}
        exact
        path={path}
        render={() => <Redirect to={redirect} />}
      />
    );
  }

  createUnauthorizedRoute = (route) => {
    const { isLogin } = this.props;
    const { path, redirect } = route;

    if (isLogin && redirect) {
      return this.createRedirectRoute(route);
    }
    return (
      <Route
        key={path}
        exact
        path={path}
        render={props => (
          <AppLayout {...props}>
            <route.component {...props} />
          </AppLayout>
        )}
      />
    );
  }

  createAuthorizedRoute = (route) => {
    const { isLogin } = this.props;
    const { path } = route;

    return isLogin ? (
      <Route
        key={path}
        exact
        path={path}
        render={props => (
          <AppLayout {...props}>
            <route.component {...props} />
          </AppLayout>
        )}
      />
    ) : this.createRedirectRoute(route);
  }

  createNotFoundRoute = () => (
    <Route component={NotFound} />
  )

  render() {
    const { history } = this.props;

    return (
      <ConnectedRouter history={history}>
        <IntlProvider
          defaultLocale={locale}
          localeMap={localeMap}
        >
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
