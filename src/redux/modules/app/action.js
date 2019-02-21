import Cookie from 'js-cookie';
import {
  FETCH_DATA,
  POST_DATA,
  DELETE_DATA,
  getAysncActionCreator,
} from 'utils/createAsyncAction';
import { schema as noticesSchema } from '../entities/notices';
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
        // 一旦页面刷新登录状态可能会重置，为此需要在登录成功后向cookie中添加一个
        // user字段标识「已登录」，同时保存用户信息。在应用初始化时查看cookie中是
        // 否已有此字段，有的话就用它来恢复state中的登录状态。
        Cookie.set('user', JSON.stringify(user));

        dispatch(saveUser(user));
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
  // 登出时需要清除cookie中的user字段
  Cookie.remove('user');

  dispatch({ type: actionTypes.logout });
  dispatch(removeUser());
};

export const saveUser = user => ({
  type: actionTypes.saveUser,
  payload: user,
});

export const removeUser = () => ({
  type: actionTypes.removeUser,
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
