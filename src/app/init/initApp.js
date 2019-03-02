import Cookie from 'js-cookie';
import appActionTypes from 'redux/modules/app/actionTypes';
import {
  saveUser, fetchNotices, fetchSubscriptions,
} from 'redux/modules/app/action';
import appConfig from '../config/appConfig';

const { defaultLocale } = appConfig;

const initApp = (dispatch) => {
  // 初始化应用时查看cookie中是否有locale字段
  const locale = Cookie.get('locale');
  if (!locale) {
    // 没有的话，将默认locale存进cookie
    Cookie.set('locale', defaultLocale);
  }

  // 初始化应用时查看cookie中是否有user字段，有的话就表示已登录
  const user = Cookie.get('user');
  if (user) {
    // 恢复isLogin为true
    dispatch({ type: appActionTypes.login.successType });
    // 恢复用户信息
    dispatch(saveUser(JSON.parse(user)));
    // 重新获取通知数据
    dispatch(fetchNotices());
    // 重新获取订阅数据
    dispatch(fetchSubscriptions());
  }
};

export default initApp;
