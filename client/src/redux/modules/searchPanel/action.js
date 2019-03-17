import {
  FETCH,
  POST,
  DELETE,
  getAysncActionCreator,
} from 'utils/createAsyncAction';
import url from 'utils/url';
import actionTypes from './actionTypes';
import { schema as searchResultsSchema, getSearchResultByTid } from '../entities/searchResults';
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

export const changeSearchResultByTid = (tid, data) => ({
  type: actionTypes.changeSearchResultByTid,
  payload: { tid, data },
});

export const subscribe = tid => (dispatch, getState) => {
  const createSubscribe = getAysncActionCreator(
    POST,
    actionTypes.subscribe,
  );
  return dispatch(createSubscribe(url.subscribe(), { tid }))
    .then(() => {
      dispatch(changeSearchResultByTid(tid, {
        subscribed: true,
        subscribers: getSearchResultByTid(getState(), tid).subscribers + 1,
      }));
      dispatch(fetchSubscriptions()); // 同步更新AppHeader里的“我的订阅”
    });
};

export const unsubscribe = tid => (dispatch, getState) => {
  const createUnsubscribe = getAysncActionCreator(
    DELETE,
    actionTypes.unsubscribe,
  );
  return dispatch(createUnsubscribe(url.unsubscribe(tid)))
    .then(() => {
      dispatch(changeSearchResultByTid(tid, {
        subscribed: false,
        subscribers: getSearchResultByTid(getState(), tid).subscribers - 1,
      }));
      dispatch(fetchSubscriptions()); // 同步更新AppHeader里的“我的订阅”
    });
};
