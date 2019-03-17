import {
  FETCH,
  POST,
  DELETE,
  getAysncActionCreator,
} from 'utils/createAsyncAction';
import url from 'utils/url';
import actionTypes from './actionTypes';
import { schema as searchResultsSchema, getSearchResultByCid } from '../entities/searchResults';
import { fetchSubscriptions } from '../app/action';

export const fetchSearchResults = searchQuery => (dispatch) => {
  const createFetchSearchResults = getAysncActionCreator(
    FETCH,
    actionTypes.fetchSearchResults,
    searchResultsSchema,
  );
  return dispatch(createFetchSearchResults(url.fetchSearchResults(searchQuery)));
};

export const clearSearchResults = () => ({
  type: actionTypes.clearSearchResults,
});

export const changeSearchResultByCid = (cid, data) => ({
  type: actionTypes.changeSearchResultByCid,
  payload: { cid, data },
});

export const subscribe = cid => (dispatch, getState) => {
  const createSubscribe = getAysncActionCreator(
    POST,
    actionTypes.subscribe,
  );
  return dispatch(createSubscribe(url.subscribe(), { cid }))
    .then(() => {
      dispatch(changeSearchResultByCid(cid, {
        subscribed: true,
        subscribers: getSearchResultByCid(getState(), cid).subscribers + 1,
      }));
      dispatch(fetchSubscriptions()); // 同步更新AppHeader里的“我的订阅”
    });
};

export const unsubscribe = cid => (dispatch, getState) => {
  const createUnsubscribe = getAysncActionCreator(
    DELETE,
    actionTypes.unsubscribe,
  );
  return dispatch(createUnsubscribe(url.unsubscribe(cid)))
    .then(() => {
      dispatch(changeSearchResultByCid(cid, {
        subscribed: false,
        subscribers: getSearchResultByCid(getState(), cid).subscribers - 1,
      }));
      dispatch(fetchSubscriptions()); // 同步更新AppHeader里的“我的订阅”
    });
};
