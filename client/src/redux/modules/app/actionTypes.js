import createAsyncActionTypes from 'utils/createAsyncActionTypes';

const MODULE = 'APP';

const actionTypes = {
  clearError: `${MODULE}/CLEAR_ERROR`, // 清除错误
  login: createAsyncActionTypes(MODULE, 'LOGIN'), // 登录
  signup: createAsyncActionTypes(MODULE, 'SIGNUP'), // 注册
  userLoginSuccess: `${MODULE}/USER_LOGIN_SUCCESS`, // 用户登陆成功
  userLogoutSuccess: `${MODULE}/USER_LOGOUT_SUCCESS`, // 用户登出成功
  setUser: `${MODULE}/SET_USER`, // 保存用户
  clearUser: `${MODULE}/CLEAR_USER`, // 清除用户
  fetchNotices: createAsyncActionTypes(MODULE, 'FETCH_NOTICES'), // 获取通知
  deleteNotice: createAsyncActionTypes(MODULE, 'DELETE_NOTICE'), // 删除通知
  clearNotices: `${MODULE}/CLEAR_NOTICES`, // 清除通知
  fetchSubscriptions: createAsyncActionTypes(MODULE, 'FETCH_SUBSCRIPTIONS'), // 获取订阅
  clearSubscriptions: `${MODULE}/CLEAR_SUBSCRIPTIONS`, // 清除全部订阅数据
  clearSubscriptionById: `${MODULE}/CLEAR_SUBSCRIPTION_BY_ID`, // 清除某订阅数据
  unsubscribe: createAsyncActionTypes(MODULE, 'UNSUBSCRIBE'), // 取消订阅
  setNavigatorBar: `${MODULE}/SET_NAVIGATOR_BAR`, // 设置导航栏
};

export default actionTypes;
