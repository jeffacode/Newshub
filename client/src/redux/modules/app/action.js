import {
  FETCH,
  POST,
  DELETE,
  getAysncActionCreator,
} from 'utils/createAsyncAction';
import url from 'utils/url';
import Auth from 'utils/Auth';
import SearchHistory from 'utils/SearchHistory';
import actionTypes from './actionTypes';
import { schema as noticesSchema } from '../entities/notices';
import { schema as subscriptionsSchema } from '../entities/subscriptions';
import { fetchTopic, clearNewsList } from '../newsPanel/action';
import { clearSearchResults, changeSearchResultByTid } from '../searchPanel/action';
import { getSearchResultByTid } from '../entities/searchResults';

export const clearError = () => ({
  type: actionTypes.clearError,
});

export const login = (email, password) => (dispatch) => {
  const createLogin = getAysncActionCreator(
    POST,
    actionTypes.login,
  );
  return dispatch(createLogin(url.login(), {
    email,
    password,
  }))
    .then(({ payload }) => {
      const { token, user } = payload;
      if (token && user) {
        // 在本地存储token和user
        Auth.authenticateUser(token, user);
        // 设置用户信息
        dispatch(setUser(user));

        // 前两步完成才算成功登陆
        dispatch({ type: actionTypes.userLoginSuccess });

        // 获取通知数据
        dispatch(fetchNotices());
        // 获取订阅数据
        dispatch(fetchSubscriptions());
      }
    });
};

export const signup = (email, username, password, confirmPassword) => (dispatch) => {
  const createSignup = getAysncActionCreator(
    POST,
    actionTypes.signup,
  );
  return dispatch(createSignup(url.signup(), {
    email,
    username,
    password,
    confirmPassword,
  }));
};

export const logout = () => (dispatch) => {
  // 清除本地存储的token和user
  Auth.deauthenticateUser();
  // 清除用户信息
  dispatch(clearUser());

  // 前两步完成才算成功登出
  dispatch({ type: actionTypes.userLogoutSuccess });

  // 清除通知数据
  dispatch(clearNotices());
  // 清除订阅数据
  dispatch(clearSubscriptions());
  // 清除本地存储的搜索记录
  SearchHistory.clearSearchHistory();
  // 清除新闻数据
  dispatch(clearNewsList());
  // 清除搜索数据
  dispatch(clearSearchResults());
};

export const setUser = user => ({
  type: actionTypes.setUser,
  payload: user,
});

export const clearUser = () => ({
  type: actionTypes.clearUser,
});

export const fetchNotices = () => (dispatch) => {
  const createFetchNotices = getAysncActionCreator(
    FETCH,
    actionTypes.fetchNotices,
    noticesSchema,
  );
  return dispatch(createFetchNotices(url.fetchNotices()));
};

export const deleteNotice = id => (dispatch) => {
  const createDeleteNotice = getAysncActionCreator(
    DELETE,
    actionTypes.deleteNotice,
  );
  return dispatch(createDeleteNotice(url.deleteNotice(id)))
    .then(() => dispatch(fetchNotices())); // 删除通知后重新请求通知数据
};

export const clearNotices = () => ({
  type: actionTypes.clearNotices,
});

export const fetchSubscriptions = () => (dispatch) => {
  const createFetchSubscriptions = getAysncActionCreator(
    FETCH,
    actionTypes.fetchSubscriptions,
    subscriptionsSchema,
  );
  return dispatch(createFetchSubscriptions(url.fetchSubscriptions()));
};

export const clearSubscriptionByTid = tid => ({
  type: actionTypes.clearSubscriptionByTid,
  payload: tid,
});

export const clearSubscriptions = () => ({
  type: actionTypes.clearSubscriptions,
});

export const unsubscribe = tid => (dispatch, getState) => {
  const createUnsubscribe = getAysncActionCreator(
    DELETE,
    actionTypes.unsubscribe,
  );
  return dispatch(createUnsubscribe(url.unsubscribe(tid)))
    .then(() => {
      dispatch(fetchTopic(tid)); // 重新获取分类数据
      dispatch(clearSubscriptionByTid(tid)); // 清除当前订阅
      // 同步更新searchPanel里的搜索结果
      dispatch(changeSearchResultByTid(tid, {
        subscribed: false,
        subscribers: getSearchResultByTid(getState(), tid).subscribers - 1,
      }));
    });
};

export const setNavigatorBar = (icon, title) => ({
  type: actionTypes.setNavigatorBar,
  payload: {
    icon,
    title,
  },
});
