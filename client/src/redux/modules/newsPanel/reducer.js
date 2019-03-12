import { combineReducers } from 'redux';
import actionTypes from './actionTypes';

const initialState = {
  newsList: {
    isFetching: false,
    ids: [],
  },
  category: {
    isFetching: false,
  },
};

const newsList = (state = initialState.newsList, action) => {
  switch (action.type) {
    case actionTypes.fetchNewsList.requestType:
    case actionTypes.fetchFeedNewsList.requestType:
    case actionTypes.fetchVotedNewsList.requestType:
    case actionTypes.fetchSavedNewsList.requestType:
    case actionTypes.fetchHiddenNewsList.requestType:
      return {
        ...state,
        isFetching: true,
      };
    case actionTypes.fetchNewsList.successType:
    case actionTypes.fetchFeedNewsList.successType:
    case actionTypes.fetchVotedNewsList.successType:
    case actionTypes.fetchSavedNewsList.successType:
    case actionTypes.fetchHiddenNewsList.successType:
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(action.data.ids),
      };
    case actionTypes.fetchNewsList.failureType:
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
export const getNewsList = state => state.newsPanel.newsList.ids.map(
  id => state.entities.newsList[id],
);
export const getCategory = state => state.entities.category;
