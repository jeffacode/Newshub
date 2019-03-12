import Auth from 'utils/Auth';
import Locale from 'utils/Locale';
import appActionTypes from 'redux/modules/app/actionTypes';
import {
  setUser, fetchNotices, fetchSubscriptions,
} from 'redux/modules/app/action';
import appConfig from '../config/appConfig';

const { defaultLocale } = appConfig;

const initApp = (dispatch) => {
  if (!Locale.localeExisted()) {
    // 本地存储配置默认的locale，这步操作必须在鉴权之前完成
    Locale.storeLocale(defaultLocale);
  }

  if (Auth.isUserAuthenticated()) {
    // 恢复用户信息
    dispatch(setUser(Auth.getUser()));
    // 恢复isLogin为true
    dispatch({ type: appActionTypes.userLoginSuccess });
    // 重新获取通知数据
    dispatch(fetchNotices());
    // 重新获取订阅数据
    dispatch(fetchSubscriptions());
  }
};

export default initApp;
