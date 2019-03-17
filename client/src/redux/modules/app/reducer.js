import { combineReducers } from 'redux';
import actionTypes from './actionTypes';

const initialState = {
  error: {}, // 错误存放在全局
  isLogin: false,
  user: {},
  notices: {
    isFetching: false,
    ids: [],
  },
  subscriptions: {
    isFetching: false,
    ids: [],
  },
  navigatorBarContent: {
    icon: 'robot',
    title: '...',
  },
};

const error = (state = initialState.error, action) => {
  if (action.type === actionTypes.clearError) {
    return {};
  }
  if (action.error) {
    return action.error;
  }
  return state;
};

const isLogin = (state = initialState.isLogin, action) => {
  if (action.type === actionTypes.userLoginSuccess) {
    return true;
  }
  if (action.type === actionTypes.userLogoutSuccess) {
    return false;
  }
  return state;
};

const user = (state = initialState.user, action) => {
  switch (action.type) {
    case actionTypes.setUser:
      return action.payload;
    case actionTypes.clearUser:
      return {};
    default:
      return state;
  }
};

const notices = (state = initialState.notices, action) => {
  switch (action.type) {
    case actionTypes.fetchNotices.requestType:
      return {
        ...state,
        isFetching: true,
      };
    case actionTypes.fetchNotices.successType:
      return {
        ...state,
        isFetching: false,
        ids: action.data.ids, // 通知数据并不是分页获取的，因此直接覆盖旧数据
      };
    case actionTypes.fetchNotices.failureType:
      return {
        ...state,
        isFetching: false,
      };
    case actionTypes.clearNotices:
      return initialState.notices;
    default:
      return state;
  }
};

const subscriptions = (state = initialState.subscriptions, action) => {
  switch (action.type) {
    case actionTypes.fetchSubscriptions.requestType:
      return {
        ...state,
        isFetching: true,
      };
    case actionTypes.fetchSubscriptions.successType:
      return {
        ...state,
        isFetching: false,
        ids: action.data.ids,
      };
    case actionTypes.fetchSubscriptions.failureType:
      return {
        ...state,
        isFetching: false,
      };
    case actionTypes.clearSubscriptionByCid:
      state.ids.splice(state.ids.indexOf(action.payload), 1);
      return { ...state };
    case actionTypes.clearSubscriptions:
      return initialState.subscriptions;
    default:
      return state;
  }
};

const navigatorBarContent = (state = initialState.navigatorBarContent, action) => {
  if (action.type === actionTypes.setNavigatorBar) {
    return action.payload;
  }
  return state;
};

const reducer = combineReducers({
  error,
  isLogin,
  user,
  notices,
  subscriptions,
  navigatorBarContent,
});

export default reducer;

// selectors
export const getError = state => state.app.error;
export const getIsLogin = state => state.app.isLogin;
export const getUser = state => state.app.user;
export const getNotices = state => state.app.notices.ids.map(id => state.entities.notices[id]);
export const getIsFetchingNotices = state => state.app.notices.isFetching;
export const getSubscriptions = state => state.app.subscriptions.ids.map(
  id => state.entities.subscriptions[id],
);
export const getNavigatorBarContent = state => state.app.navigatorBarContent;
