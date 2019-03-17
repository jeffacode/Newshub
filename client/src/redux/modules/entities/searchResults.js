import actionTypes from '../searchPanel/actionTypes';

export const schema = {
  name: 'searchResults',
  id: 'category_id',
};

const initialState = {};

const reducer = (state = initialState, action) => {
  if (action.data && action.data[schema.name]) {
    return {
      ...state,
      ...action.data[schema.name],
    };
  }

  if (action.type === actionTypes.changeSearchResultByCid) {
    const { cid, data } = action.payload;
    return {
      ...state,
      [cid]: {
        ...state[cid],
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
export const getSearchResultByCid = (state, cid) => state.entities.searchResults[cid];
