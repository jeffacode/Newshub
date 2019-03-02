import Cookie from 'js-cookie';
import {
  FETCH_DATA,
  POST_DATA,
  DELETE_DATA,
  getAysncActionCreator,
} from 'utils/createAsyncAction';
import { schema as noticesSchema } from '../entities/notices';
import { schema as subscriptionsSchema } from '../entities/subscriptions';
import actionTypes from './actionTypes';

export const clearErrorMsg = () => ({
  type: actionTypes.clearErrorMsg,
});

export const login = (username, password) => (dispatch) => {
  const createLogin = getAysncActionCreator(
    POST_DATA,
    actionTypes.login,
    { withoutErrorResponse: true },
  );
  return dispatch(createLogin('/login', {
    username,
    password,
  }))
    .then((action) => {
      const user = action.payload;
      if (user) {
        // 一旦页面刷新登录状态可能会重置，为此需要在登录成功后向cookie中添加一个user字段标识「已登录」
        Cookie.set('user', JSON.stringify(user));
        // 保存用户信息
        dispatch(saveUser(user));
        // 获取通知数据
        dispatch(fetchNotices());
        // 获取订阅数据
        dispatch(fetchSubscriptions());
      }
    })
    .catch(() => dispatch(setLoginErrorMsg()));
};

export const setLoginErrorMsg = () => ({
  type: actionTypes.setLoginErrorMsg,
  payload: 'login_failed',
});

export const clearLoginErrorMsg = () => ({
  type: actionTypes.clearLoginErrorMsg,
});

export const logout = () => (dispatch) => {
  dispatch({ type: actionTypes.logout });
  // 登出时需要清除cookie中的user字段
  Cookie.remove('user');
  // 清除用户信息
  dispatch(clearUser());
  // 清除通知数据
  dispatch(clearNotices());
  // 清除订阅数据
  dispatch(clearSubscriptions());
};

export const saveUser = user => ({
  type: actionTypes.saveUser,
  payload: user,
});

export const clearUser = () => ({
  type: actionTypes.clearUser,
});

export const fetchNotices = () => (dispatch) => {
  const createFetchNotices = getAysncActionCreator(
    FETCH_DATA,
    actionTypes.fetchNotices,
    noticesSchema,
  );
  return dispatch(createFetchNotices('/notices'));
};

export const deleteNotice = id => (dispatch) => {
  const createDeleteNotice = getAysncActionCreator(
    DELETE_DATA,
    actionTypes.deleteNotice,
  );
  return dispatch(createDeleteNotice(`/notices/${id}`))
    .then(() => dispatch(fetchNotices())); // 删除通知后重新请求通知数据
};

export const clearNotices = () => ({
  type: actionTypes.clearNotices,
});

export const fetchSubscriptions = () => (dispatch) => {
  const createFetchSubscriptions = getAysncActionCreator(
    FETCH_DATA,
    actionTypes.fetchSubscriptions,
    subscriptionsSchema,
  );
  return dispatch(createFetchSubscriptions('/subscriptions'));
};

export const unsubscribe = id => (dispatch) => {
  const createUnsubscribe = getAysncActionCreator(
    DELETE_DATA,
    actionTypes.unsubscribe,
  );
  return dispatch(createUnsubscribe(`/subscriptions/${id}`))
    .then(() => dispatch(fetchSubscriptions()));
};

export const clearSubscriptions = () => ({
  type: actionTypes.clearSubscriptions,
});

export const selectView = view => ({
  type: actionTypes.selectView,
  payload: view,
});

export const setNavigatorBar = (icon, title) => ({
  type: actionTypes.setNavigatorBar,
  payload: {
    icon,
    title,
  },
});
