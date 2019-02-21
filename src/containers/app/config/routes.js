import Login from 'containers/login';
import Unauthorized from 'containers/unauthorized';
import Loading from 'components/Loading';

// 需要权限访问的路由
const authorizedRoutes = [{
  path: '/dashboard/analysis/realtime',
  exact: true,
  permissions: ['admin'],
  redirect: '/',
  component: Loading,
  pageTitle: '',
}, {
  path: '/dashboard/analysis/offline',
  exact: true,
  permissions: ['admin', 'user'],
  redirect: '/',
  component: Loading,
  pageTitle: '',
}, {
  path: '/dashboard/workplace',
  exact: true,
  permissions: ['admin'],
  redirect: '/',
  component: Loading,
  pageTitle: '',
}, {
  path: '/outlets',
  exact: true,
  permissions: ['admin', 'user'],
  component: Loading,
  unauthorized: Unauthorized,
  pageTitle: 'pageTitle_outlets',
  breadcrumb: ['/outlets'],
}, {
  path: '/outlets/:id',
  exact: true,
  permissions: ['admin', 'user'],
  component: Loading,
  unauthorized: Unauthorized,
  pageTitle: 'pageTitle_outletDetail',
  breadcrumb: ['/outlets', '/outlets/:id'],
}, {
  path: '/exception/403',
  exact: true,
  permissions: ['god'],
  component: Loading,
  unauthorized: Unauthorized,
}];

// 无需权限访问的路由
const normalRoutes = [{
  path: '/',
  exact: true,
  redirect: '/outlets',
}, {
  path: '/login',
  exact: true,
  component: Login,
}];

const combineRoutes = [
  ...authorizedRoutes,
  ...normalRoutes,
];

export {
  authorizedRoutes,
  normalRoutes,
  combineRoutes,
};
