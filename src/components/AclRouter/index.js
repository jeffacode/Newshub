import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import map from 'lodash/map';
import isNil from 'lodash/isNil';
import omitRouteRenderProperties from './utils/omitRouteRenderProperties';
import checkPermissions from './utils/checkPermissions';
import DefaultLayout from './DefaultLayout';
import DefaultNotFound from './DefaultNotFound';

class AclRouter extends Component {
  // 创建跳转Route
  renderRedirectRoute = route => (
    <Route
      key={route.path}
      {...omitRouteRenderProperties(route)}
      render={() => <Redirect to={route.redirect} />}
    />
  );

  // 创建需鉴权的Route
  renderAuthorizedRoute = (route) => {
    const { authorizedLayout: AuthorizedLayout, authorities } = this.props;
    const {
      permissions,
      path,
      component: RouteComponent,
      unauthorized: Unauthorized,
    } = route;

    const hasPermission = checkPermissions(authorities, permissions);

    // 没权限但有unauthorized，匹配后在布局中显示无权限页
    if (!hasPermission && route.unauthorized) {
      return (
        <Route
          key={path}
          {...omitRouteRenderProperties(route)}
          render={props => (
            <AuthorizedLayout {...props}>
              <Unauthorized {...props} />
            </AuthorizedLayout>
          )}
        />
      );
    }

    // 没权限但有redirect，匹配后进行跳转
    if (!hasPermission && route.redirect) {
      return this.renderRedirectRoute(route);
    }

    // 有权限，匹配后布局中显示对应的组件
    return (
      <Route
        key={path}
        {...omitRouteRenderProperties(route)}
        render={props => (
          <AuthorizedLayout {...props}>
            <RouteComponent {...props} />
          </AuthorizedLayout>
        )}
      />
    );
  }

  // 创建无需鉴权的Route
  renderUnAuthorizedRoute = (route) => {
    const { normalLayout: NormalLayout } = this.props;
    const { redirect, path, component: RouteComponent } = route;

    // 没component但有redirect，匹配后进行跳转
    if (isNil(RouteComponent) && !isNil(redirect)) {
      return this.renderRedirectRoute(route);
    }

    // 有component，匹配后在布局中显示组件
    return (
      <Route
        key={path}
        {...omitRouteRenderProperties(route)}
        render={props => (
          <NormalLayout {...props}>
            <RouteComponent {...props} />
          </NormalLayout>
        )}
      />
    );
  }

  // 创建404页面的Route
  renderNotFoundRoute = () => {
    const { notFound: NotFound } = this.props;
    return (
      <Route
        render={props => (
          <NotFound {...props} />
        )}
      />
    );
  }

  render() {
    const { normalRoutes, authorizedRoutes } = this.props;
    return (
      <Switch>
        {map(normalRoutes, route => (
          this.renderUnAuthorizedRoute(route)
        ))}
        {map(authorizedRoutes, route => (
          this.renderAuthorizedRoute(route)
        ))}
        {this.renderNotFoundRoute()}
      </Switch>
    );
  }
}

AclRouter.propTypes = {
  authorities: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.func,
  ]),
  normalRoutes: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    redirect: PropTypes.string,
    component: PropTypes.func,
  })),
  normalLayout: PropTypes.func,
  authorizedRoutes: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    permissions: PropTypes.arrayOf(PropTypes.string),
    component: PropTypes.func,
    redirect: PropTypes.string,
    unauthorized: PropTypes.func,
  })),
  authorizedLayout: PropTypes.func,
  notFound: PropTypes.func,
};

AclRouter.defaultProps = {
  authorities: '',
  normalRoutes: [],
  normalLayout: DefaultLayout,
  authorizedRoutes: [],
  authorizedLayout: DefaultLayout,
  notFound: DefaultNotFound,
};

export default AclRouter;
