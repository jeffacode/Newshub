import NewsPanel from 'containers/NewsPanel';
import Login from 'containers/Login';
import Signup from 'containers/Signup';

// 无需登录就能显示的路由
export const unauthorizedRoutes = [
  {
    path: '/',
    component: NewsPanel,
  },
  {
    path: '/c/:category',
    component: NewsPanel,
  },
  {
    path: '/login',
    component: Login, // 未登录显示当前页，登录跳/
    redirect: '/',
  },
  {
    path: '/signup',
    component: Signup,
    redirect: '/',
  },
];

// 需要登录才能显示的路由
export const authorizedRoutes = [
  {
    path: '/u/:username/:subCategory',
    component: NewsPanel, // 登录显示当前页
    redirect: '/login', // 未登录跳/login
  },
  {
    path: '/settings/:mainCategory/:subCategory',
    component: NewsPanel,
    redirect: '/login',
  },
];
