import Cookie from 'js-cookie';
import appActionTypes from 'redux/modules/app/actionTypes';
import { saveUser, fetchNotices } from 'redux/modules/app/action';
import appConfig from '../config/appConfig';

const { defaultLocale } = appConfig;

const initApp = (dispatch) => {
  // 初始化应用时查看cookie中是否有locale字段
  const locale = Cookie.get('locale');
  if (!locale) {
    // 没有的话，将默认locale存进cookie
    Cookie.set('locale', defaultLocale);
  }

  // 初始化应用时查看cookie中是否有user字段
  const user = Cookie.get('user');
  if (user) {
    // 恢复isLogin和user状态
    dispatch({ type: appActionTypes.login.successType });
    dispatch(saveUser(JSON.parse(user)));

    // 获取通知数据
    dispatch(fetchNotices());
  }
};

export default initApp;
