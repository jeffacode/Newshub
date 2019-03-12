import Login from 'containers/Login';
import Signup from 'containers/Signup';
import NewsPanel from 'containers/NewsPanel';
import SearchPanel from 'containers/SearchPanel';
import NotFound from 'containers/NotFound';
import Loading from 'components/Loading';

// 无需登录就能显示的路由
export const unauthorizedRoutes = [
  {
    path: '/',
    redirect: '/home', // /直接跳转到/home
  },
  {
    path: '/login',
    component: Login,
    redirect: '/', // 已登录就跳转到/
  },
  {
    path: '/signup',
    component: Signup,
    redirect: '/',
  },
  {
    path: '/404',
    component: NotFound,
  },
];

// 需要登录才能显示的路由
export const authorizedRoutes = [
  {
    path: '/home',
    component: NewsPanel,
    redirect: '/login', // 未登录就跳转到/login
  },
  {
    path: '/popular',
    component: NewsPanel,
    redirect: '/login',
  },
  {
    path: '/all',
    component: NewsPanel,
    redirect: '/login',
  },
  {
    path: '/c/:cid',
    component: NewsPanel,
    redirect: '/login',
  },
  {
    path: '/search',
    component: SearchPanel,
    redirect: '/login',
  },
  {
    path: '/u/:username/:profile',
    component: NewsPanel,
    redirect: '/login',
  },
  {
    path: '/settings/:main/:sub',
    component: Loading,
    redirect: '/login',
  },
];
