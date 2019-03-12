import { combineReducers } from 'redux';
import actionTypes from './actionTypes';

const initialState = {
  searchResults: {
    isFetching: false,
    ids: [],
  },
};

const searchResults = (state = initialState.searchResults, action) => {
  switch (action.type) {
    case actionTypes.fetchSearchResults.requestType:
      return {
        ...state,
        isFetching: true,
      };
    case actionTypes.fetchSearchResults.successType:
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(action.data.ids),
      };
    case actionTypes.fetchSearchResults.failureType:
      return {
        ...state,
        isFetching: false,
      };
    case actionTypes.clearSearchResults:
      return initialState.searchResults;
    default:
      return state;
  }
};

const reducer = combineReducers({
  searchResults,
});

export default reducer;

// selectors
export const getSearchResults = state => state.searchPanel.searchResults.ids.map(
  id => state.entities.searchResults[id],
);
