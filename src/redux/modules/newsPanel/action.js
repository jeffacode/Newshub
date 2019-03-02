import {
  FETCH_DATA,
  CHANGE_DATA,
  getAysncActionCreator,
} from 'utils/createAsyncAction';
import { setNavigatorBar } from 'redux/modules/app/action';
import { getCategory } from './reducer';
import actionTypes from './actionTypes';
import { schema as newsSchema } from '../entities/news';
import { schema as categorySchema } from '../entities/category';

export const fetchNews = params => (dispatch) => {
  const createFetchNews = getAysncActionCreator(
    FETCH_DATA,
    actionTypes.fetchNews,
    newsSchema,
  );
  return dispatch(createFetchNews('/news', params));
};

export const clearNews = () => ({
  type: actionTypes.clearNews,
});

export const fetchCategory = name => (dispatch, getState) => {
  const createFetchCategory = getAysncActionCreator(
    FETCH_DATA,
    actionTypes.fetchCategory,
    categorySchema,
  );
  return dispatch(createFetchCategory('/categories', { name }))
    .then(() => {
      const { name, icon } = getCategory(getState());
      return dispatch(setNavigatorBar(icon, `/c/${name}`)); // 请求类型数据成功后设置导航栏内容
    });
};

export const voteNews = (id, data) => (dispatch) => {
  const createVoteNews = getAysncActionCreator(
    CHANGE_DATA,
    actionTypes.voteNews,
  );
  return dispatch(createVoteNews(`/news/${id}`, data))
    .then((action) => {
      const { payload } = action;
      return dispatch(changeNews(id, payload));
    });
};

export const saveNews = (id, data) => (dispatch) => {
  const createSaveNews = getAysncActionCreator(
    CHANGE_DATA,
    actionTypes.saveNews,
  );
  return dispatch(createSaveNews(`/news/${id}`, data))
    .then((action) => {
      const { payload } = action;
      return dispatch(changeNews(id, payload));
    });
};

export const hideNews = (id, data) => (dispatch) => {
  const createHideNews = getAysncActionCreator(
    CHANGE_DATA,
    actionTypes.hideNews,
  );
  return dispatch(createHideNews(`/news/${id}`, data))
    .then((action) => {
      const { payload } = action;
      return dispatch(changeNews(id, payload));
    });
};

export const changeNews = (id, data) => ({
  type: actionTypes.changeNews,
  payload: { id, data },
});
