import {
  FETCH,
  POST,
  getAysncActionCreator,
} from 'utils/createAsyncAction';
import url from 'utils/url';
import actionTypes from './actionTypes';
import { schema as newsListSchema } from '../entities/newsList';
import { schema as categorySchema } from '../entities/category';

// strategies[previous voted, state] => [current voted, incremental votes]
const strategies = {
  [-1]: {
    1: [1, 2],
    [-1]: [0, 1],
  },
  0: {
    1: [1, 1],
    [-1]: [-1, -1],
  },
  1: {
    1: [0, -1],
    [-1]: [-1, -2],
  },
};

export const fetchNewsList = cid => (dispatch) => {
  const createFetchNewsList = getAysncActionCreator(
    FETCH,
    actionTypes.fetchNewsList,
    newsListSchema,
  );
  return dispatch(createFetchNewsList(url.fetchNewsList(cid)));
};

export const fetchFeedNewsList = feed => (dispatch) => {
  const createFetchFeedNewsList = getAysncActionCreator(
    FETCH,
    actionTypes.fetchFeedNewsList,
    newsListSchema,
  );
  return dispatch(createFetchFeedNewsList(url.fetchFeedNewsList(feed)));
};

export const fetchVotedNewsList = v => (dispatch) => {
  const createFetchVotedNewsList = getAysncActionCreator(
    FETCH,
    actionTypes.fetchVotedNewsList,
    newsListSchema,
  );
  return dispatch(createFetchVotedNewsList(url.fetchVotedNewsList(v)));
};

export const fetchSavedNewsList = () => (dispatch) => {
  const createFetchSavedNewsList = getAysncActionCreator(
    FETCH,
    actionTypes.fetchSavedNewsList,
    newsListSchema,
  );
  return dispatch(createFetchSavedNewsList(url.fetchSavedNewsList()));
};

export const fetchHiddenNewsList = () => (dispatch) => {
  const createFetchHiddenNewsList = getAysncActionCreator(
    FETCH,
    actionTypes.fetchHiddenNewsList,
    newsListSchema,
  );
  return dispatch(createFetchHiddenNewsList(url.fetchHiddenNewsList()));
};

export const clearNewsList = () => ({
  type: actionTypes.clearNewsList,
});

export const fetchCategory = id => (dispatch) => {
  const createFetchCategory = getAysncActionCreator(
    FETCH,
    actionTypes.fetchCategory,
    categorySchema,
  );
  return dispatch(createFetchCategory(url.fetchCategory(id)));
};

export const voteNews = (id, votes, voted, state) => (dispatch) => {
  const createVoteNews = getAysncActionCreator(
    POST,
    actionTypes.voteNews,
  );
  return dispatch(createVoteNews(url.voteNews(), { id, state }))
    .then(() => {
      const [currentVoted, incrementalVotes] = strategies[voted][state];
      dispatch(changeNewsById(id, {
        voted: currentVoted,
        votes: votes + incrementalVotes,
      }));
    });
};

export const saveNews = (id, saved) => (dispatch) => {
  const createSaveNews = getAysncActionCreator(
    POST,
    actionTypes.saveNews,
  );
  return dispatch(createSaveNews(url.saveNews(), { id }))
    .then(() => dispatch(changeNewsById(id, { saved })));
};

export const hideNews = (id, hidden) => (dispatch) => {
  const createHideNews = getAysncActionCreator(
    POST,
    actionTypes.hideNews,
  );
  return dispatch(createHideNews(url.hideNews(), { id }))
    .then(() => dispatch(changeNewsById(id, { hidden })));
};

export const changeNewsById = (id, data) => ({
  type: actionTypes.changeNewsById,
  payload: { id, data },
});
