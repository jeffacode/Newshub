import {
  FETCH,
  POST,
  DELETE,
  getAysncActionCreator,
} from 'utils/createAsyncAction';
import url from 'utils/url';
import actionTypes from './actionTypes';
import { schema as searchResultsSchema } from '../entities/searchResults';
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

export const changeSearchResultById = (id, data) => ({
  type: actionTypes.changeSearchResultById,
  payload: { id, data },
});

export const subscribe = (id, subscribers) => (dispatch) => {
  const createSubscribe = getAysncActionCreator(
    POST,
    actionTypes.subscribe,
  );
  return dispatch(createSubscribe(url.subscribe(), { cid: id }))
    .then(() => {
      dispatch(changeSearchResultById(id, {
        subscribed: true,
        subscribers: subscribers + 1,
      }));
      dispatch(fetchSubscriptions()); // 同步更新AppHeader里的“我的订阅”
    });
};

export const unsubscribe = (id, subscribers) => (dispatch) => {
  const createUnsubscribe = getAysncActionCreator(
    DELETE,
    actionTypes.unsubscribe,
  );
  return dispatch(createUnsubscribe(url.unsubscribe(id)))
    .then(() => {
      dispatch(changeSearchResultById(id, {
        subscribed: false,
        subscribers: subscribers - 1,
      }));
      dispatch(fetchSubscriptions()); // 同步更新AppHeader里的“我的订阅”
    });
};
