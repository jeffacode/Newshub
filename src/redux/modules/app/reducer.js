import { combineReducers } from 'redux';
import actionTypes from './actionTypes';

const initalState = {
  errorMsg: '', // 全局的请求错误提示
  login: {
    isLogin: false,
    loginErrorMsg: '', // 定制的登录失败提示
  },
  user: {}, // 包含用户id、用户名和角色权限
  notices: {
    isFetching: false,
    ids: [],
  },
};

const errorMsg = (state = initalState.errorMsg, action) => {
  if (action.type === actionTypes.clearErrorMsg) {
    return '';
  }
  if (action.errorResponse) {
    return action.errorResponse;
  }
  return state;
};

const login = (state = initalState.login, action) => {
  if (action.type === actionTypes.login.successType) {
    return {
      ...state,
      isLogin: true,
    };
  }
  if (action.type === actionTypes.logout) {
    return {
      ...state,
      isLogin: false,
    };
  }
  if (action.type === actionTypes.setLoginErrorMsg) {
    return {
      ...state,
      loginErrorMsg: action.payload,
    };
  }
  if (action.type === actionTypes.clearLoginErrorMsg) {
    return {
      ...state,
      loginErrorMsg: '',
    };
  }
  return state;
};

const user = (state = initalState.user, action) => {
  switch (action.type) {
    case actionTypes.saveUser:
      return action.payload;
    case actionTypes.removeUser:
      return {};
    default:
      return state;
  }
};

const notices = (state = initalState.notices, action) => {
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
        ids: action.response.ids, // 通知数据并不是分页获取的，因此直接覆盖旧数据
      };
    case actionTypes.fetchNotices.failureType:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

const reducer = combineReducers({
  errorMsg,
  login,
  user,
  notices,
});

export default reducer;

// selectors
export const getErrorMsg = state => state.app.errorMsg;
export const getIsLogin = state => state.app.login.isLogin;
export const getLoginErrorMsg = state => state.app.login.loginErrorMsg;
export const getUser = state => state.app.user;
export const getNotices = state => state.app.notices.ids.map(id => state.entities.notices[id]);
export const getIsFetchingNotices = state => state.app.notices.isFetching;
