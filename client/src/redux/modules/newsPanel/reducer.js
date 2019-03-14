import { combineReducers } from 'redux';
import actionTypes from './actionTypes';

const initialState = {
  newsList: {
    isFetching: false,
    page2Ids: {}, // { page: [ id... ], ... }
    id2Page: {}, // { id: page, ... }
    metadata: {
      page: 1,
      total: 0,
    },
  },
  category: {
    isFetching: false,
  },
};

const newsList = (state = initialState.newsList, action) => {
  switch (action.type) {
    case actionTypes.fetchCategoryNewsList.requestType:
    case actionTypes.fetchFeedNewsList.requestType:
    case actionTypes.fetchVotedNewsList.requestType:
    case actionTypes.fetchSavedNewsList.requestType:
    case actionTypes.fetchHiddenNewsList.requestType:
      return {
        ...state,
        isFetching: true,
      };
    case actionTypes.fetchCategoryNewsList.successType:
    case actionTypes.fetchFeedNewsList.successType:
    case actionTypes.fetchVotedNewsList.successType:
    case actionTypes.fetchSavedNewsList.successType:
    case actionTypes.fetchHiddenNewsList.successType:
      return {
        ...state,
        isFetching: false,
        page2Ids: {
          ...state.page2Ids,
          [action.data.metadata.page]: action.data.ids,
        },
        id2Page: {
          ...state.id2Page,
          ...action.data.ids.reduce((result, id) => ({
            ...result,
            [id]: action.data.metadata.page,
          }), {}),
        },
        metadata: action.data.metadata,
      };
    case actionTypes.fetchCategoryNewsList.failureType:
    case actionTypes.fetchFeedNewsList.failureType:
    case actionTypes.fetchVotedNewsList.failureType:
    case actionTypes.fetchSavedNewsList.failureType:
    case actionTypes.fetchHiddenNewsList.failureType:
      return {
        ...state,
        isFetching: false,
      };
    case actionTypes.clearNewsList:
      return initialState.newsList;
    case actionTypes.changePage:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          page: action.payload,
        },
      };
    default:
      return state;
  }
};

const category = (state = initialState.category, action) => {
  switch (action.type) {
    case actionTypes.fetchCategory.requestType:
      return {
        ...state,
        isFetching: true,
      };
    case actionTypes.fetchCategory.successType:
      return {
        ...state,
        isFetching: false,
      };
    case actionTypes.fetchCategory.failureType:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

const reducer = combineReducers({
  newsList,
  category,
});

export default reducer;

// selectors
export const getNewsListByPage = (state) => {
  const { page2Ids, metadata: { page } } = state.newsPanel.newsList;
  const { newsList } = state.entities;
  if (page2Ids[page]) {
    return page2Ids[page].map(id => newsList[page][id]);
  }
  return [];
};
export const getHistoryPages = state => Object.keys(state.newsPanel.newsList.page2Ids)
  .map(id => parseInt(id, 10));
export const getPageById = (state, id) => state.newsPanel.newsList.id2Page[id];
export const getNewsListMetadata = state => state.newsPanel.newsList.metadata;
export const getCategory = state => state.entities.category;
export const getNewsListIsFetching = state => state.newsPanel.newsList.isFetching;
