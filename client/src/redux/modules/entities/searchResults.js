import actionTypes from '../searchPanel/actionTypes';

export const schema = {
  name: 'searchResults',
  id: 'id',
};

const initialState = {};

const reducer = (state = initialState, action) => {
  if (action.data && action.data[schema.name]) {
    return {
      ...state,
      ...action.data[schema.name],
    };
  }

  if (action.type === actionTypes.changeSearchResultById) {
    const { id, data } = action.payload;
    return {
      ...state,
      [id]: {
        ...state[id],
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
