import actionTypes from '../searchPanel/actionTypes';

export const schema = {
  name: 'searchResults',
  id: 'topic_id',
};

const initialState = {};

const reducer = (state = initialState, action) => {
  if (action.data && action.data[schema.name]) {
    return {
      ...state,
      ...action.data[schema.name],
    };
  }

  if (action.type === actionTypes.changeSearchResultByTid) {
    const { tid, data } = action.payload;
    return {
      ...state,
      [tid]: {
        ...state[tid],
        ...data,
      },
    };
  }

  if (action.type === actionTypes.clearSearchResults) {
    return initialState;
  }

  return state;
};

export default reducer;

// selector
export const getSearchResultByTid = (state, tid) => state.entities.searchResults[tid];
