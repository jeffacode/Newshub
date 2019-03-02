import { combineReducers } from 'redux';
import actionTypes from './actionTypes';

export const views = [
  {
    id: 1,
    name: 'appHeader_viewSwitch_card',
    type: 'card',
    icon: 'pic-center',
  },
  {
    id: 2,
    name: 'appHeader_viewSwitch_classic',
    type: 'classic',
    icon: 'pic-left',
  },
  {
    id: 3,
    name: 'appHeader_viewSwitch_compact',
    type: 'compact',
    icon: 'bars',
  },
];

const initialState = {
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
  subscriptions: {
    isFetching: false,
    ids: [],
  },
  selectedView: views[0], // 初始选择card
  navigatorBarContent: {
    icon: 'robot',
    title: '...',
  },
};

const errorMsg = (state = initialState.errorMsg, action) => {
  if (action.type === actionTypes.clearErrorMsg) {
    return '';
  }
  if (action.errorResponse) {
    return action.errorResponse;
  }
  return state;
};

const login = (state = initialState.login, action) => {
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

const user = (state = initialState.user, action) => {
  switch (action.type) {
    case actionTypes.saveUser:
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
        ids: action.response.ids, // 通知数据并不是分页获取的，因此直接覆盖旧数据
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
        ids: action.response.ids,
      };
    case actionTypes.fetchSubscriptions.failureType:
      return {
        ...state,
        isFetching: false,
      };
    case actionTypes.clearSubscriptions:
      return initialState.subscriptions;
    default:
      return state;
  }
};

const selectedView = (state = initialState.selectedView, action) => {
  if (action.type === actionTypes.selectView) {
    return action.payload;
  }
  return state;
};

const navigatorBarContent = (state = initialState.navigatorBarContent, action) => {
  if (action.type === actionTypes.setNavigatorBar) {
    return action.payload;
  }
  return state;
};

const reducer = combineReducers({
  errorMsg,
  login,
  user,
  notices,
  subscriptions,
  selectedView,
  navigatorBarContent,
});

export default reducer;

// selectors
export const getErrorMsg = state => state.app.errorMsg;
export const getIsLogin = state => state.app.login.isLogin;
export const getLoginErrorMsg = state => state.app.login.loginErrorMsg;
export const getUser = state => state.app.user;
export const getNotices = state => state.app.notices.ids.map(id => state.entities.notices[id]);
export const getIsFetchingNotices = state => state.app.notices.isFetching;
export const getSubscriptions = state => state.app.subscriptions.ids.map(
  id => state.entities.subscriptions[id],
);
export const getSelectedView = state => state.app.selectedView;
export const getNavigatorBarContent = state => state.app.navigatorBarContent;
