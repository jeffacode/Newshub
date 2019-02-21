import createAsyncActionTypes from 'utils/createAsyncActionTypes';

const MODULE = 'APP';

const actionTypes = {
  clearErrorMsg: `${MODULE}/CLEAR_ERROR_MESSAGE`, // 清除错误消息
  login: createAsyncActionTypes(MODULE, 'LOGIN'), // 请求登录
  setLoginErrorMsg: `${MODULE}/SET_LOGIN_ERROR_MESSAGE`, // 设置登录错误消息
  clearLoginErrorMsg: `${MODULE}/CLEAR_LOGIN_ERROR_MESSAGE`, // 清除登录错误消息
  logout: `${MODULE}/LOGOUT`, // 退出登录
  saveUser: `${MODULE}/SAVE_USER`, // 保存用户
  removeUser: `${MODULE}/REMOVE_USER`, // 清除用户
  fetchNotices: createAsyncActionTypes(MODULE, 'FETCH_NOTICES'), // 获取通知
  deleteNotice: createAsyncActionTypes(MODULE, 'DELETE_NOTICE'), // 删除通知
};

export default actionTypes;
