import {
  FETCH,
  POST,
  getAysncActionCreator,
} from 'utils/createAsyncAction';
import url from 'utils/url';
import voteStrategies from 'constant/voteStrategies';
import actionTypes from './actionTypes';
import { getPageById } from './reducer';
import { schema as newsListSchema } from '../entities/newsList';
import { schema as topicSchema } from '../entities/topic';

export const fetchTopicNewsList = queries => (dispatch) => {
  const createFetchTopicNewsList = getAysncActionCreator(
    FETCH,
    actionTypes.fetchTopicNewsList,
    newsListSchema,
  );
  return dispatch(createFetchTopicNewsList(url.fetchTopicNewsList(), queries));
};

export const fetchFeedNewsList = queries => (dispatch) => {
  const createFetchFeedNewsList = getAysncActionCreator(
    FETCH,
    actionTypes.fetchFeedNewsList,
    newsListSchema,
  );
  return dispatch(createFetchFeedNewsList(url.fetchFeedNewsList(), queries));
};

export const fetchVotedNewsList = queries => (dispatch) => {
  const createFetchVotedNewsList = getAysncActionCreator(
    FETCH,
    actionTypes.fetchVotedNewsList,
    newsListSchema,
  );
  return dispatch(createFetchVotedNewsList(url.fetchVotedNewsList(), queries));
};

export const fetchSavedNewsList = queries => (dispatch) => {
  const createFetchSavedNewsList = getAysncActionCreator(
    FETCH,
    actionTypes.fetchSavedNewsList,
    newsListSchema,
  );
  return dispatch(createFetchSavedNewsList(url.fetchSavedNewsList(), queries));
};

export const fetchHiddenNewsList = queries => (dispatch) => {
  const createFetchHiddenNewsList = getAysncActionCreator(
    FETCH,
    actionTypes.fetchHiddenNewsList,
    newsListSchema,
  );
  return dispatch(createFetchHiddenNewsList(url.fetchHiddenNewsList(), queries));
};

export const clearNewsList = () => ({
  type: actionTypes.clearNewsList,
});

export const fetchTopic = tid => (dispatch) => {
  const createFetchTopic = getAysncActionCreator(
    FETCH,
    actionTypes.fetchTopic,
    topicSchema,
  );
  return dispatch(createFetchTopic(url.fetchTopic(tid)));
};

export const voteNews = (id, votes, voted, state) => (dispatch) => {
  const createVoteNews = getAysncActionCreator(
    POST,
    actionTypes.voteNews,
  );
  return dispatch(createVoteNews(url.voteNews(), { id, state }))
    .then(() => {
      const [currentVoted, incrementalVotes] = voteStrategies[voted][state];
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

export const sendClickLog = id => (dispatch) => {
  const createSendClickLog = getAysncActionCreator(
    POST,
    actionTypes.sendClickLog,
  );
  return dispatch(createSendClickLog(url.sendClickLog(), { id }));
};

export const changeNewsById = (id, data) => (dispatch, getState) => dispatch({
  type: actionTypes.changeNewsById,
  payload: {
    id,
    data,
    page: getPageById(getState(), id),
  },
});

export const changePage = page => ({
  type: actionTypes.changePage,
  payload: page,
});
