import actionTypes from '../newsPanel/actionTypes';

export const schema = {
  name: 'newsList',
  id: 'id',
};

// { page: { id: data, ... }, ... }
const initialState = {};

const reducer = (state = initialState, action) => {
  if (action.data && action.data[schema.name]) {
    return {
      ...state,
      [action.data.metadata.page]: action.data[schema.name],
    };
  }

  if (action.type === actionTypes.changeNewsById) {
    const { id, page, data } = action.payload;
    return {
      ...state,
      [page]: {
        ...state[page],
        [id]: {
          ...state[page][id],
          ...data,
        },
      },
    };
  }

  if (action.type === actionTypes.clearNewsList) {
    return initialState;
  }

  return state;
};

export default reducer;
