import { combineReducers } from 'redux';
import actionTypes from './actionTypes';

const initialState = {
  news: {
    isFetching: false,
    ids: [],
  },
  category: {
    isFetching: false,
    ids: [],
  },
};

const news = (state = initialState.news, action) => {
  switch (action.type) {
    case actionTypes.fetchNews.requestType:
      return {
        ...state,
        isFetching: true,
      };
    case actionTypes.fetchNews.successType:
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(action.response.ids),
      };
    case actionTypes.fetchNews.failureType:
      return {
        ...state,
        isFetching: false,
      };
    case actionTypes.clearNews:
      return initialState.news;
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
        ids: action.response.ids,
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
  news,
  category,
});

export default reducer;

// selectors
export const getNews = state => state.newsPanel.news.ids.map(id => state.entities.news[id]);
export const getCategory = state => state.entities.category[state.newsPanel.category.ids[0]];
