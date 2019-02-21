import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import { ConnectedRouter } from 'connected-react-router';
import { IntlProvider } from 'components/IntlContext';
import AclRouter from 'components/AclRouter';
import BasicLayout from 'layouts/BasicLayout';
import NormalLayout from 'layouts/NormalLayout';
import NotFound from 'containers/notFound';
import { getUser } from 'redux/modules/app/reducer';
import appConfig from '../config/appConfig';
import { authorizedRoutes, normalRoutes } from '../config/routes';

const locale = Cookie.get('locale'); // 从cookie中取出locale
const { localeMap } = appConfig;

const Router = ({ user, history }) => (
  <ConnectedRouter history={history}>
    <IntlProvider
      defaultLocale={locale}
      localeMap={localeMap}
    >
      <AclRouter
        authorities={user.authorities}
        authorizedRoutes={authorizedRoutes}
        authorizedLayout={BasicLayout}
        normalRoutes={normalRoutes}
        normalLayout={NormalLayout}
        notFound={NotFound}
      />
    </IntlProvider>
  </ConnectedRouter>
);

Router.propTypes = {
  // 通过connect传入
  user: PropTypes.object.isRequired,
  // 通过props传入
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: getUser(state),
});

export default connect(mapStateToProps)(Router);
