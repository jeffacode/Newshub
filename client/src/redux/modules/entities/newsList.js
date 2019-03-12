import actionTypes from '../newsPanel/actionTypes';

export const schema = {
  name: 'newsList',
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

  if (action.type === actionTypes.changeNewsById) {
    const { id, data } = action.payload;
    return {
      ...state,
      [id]: {
        ...state[id],
        ...data,
      },
    };
  }

  if (action.type === actionTypes.clearNewsList) {
    return initialState;
  }

  return state;
};

export default reducer;

// selector
export const getNewsById = (state, id) => state.entities.newsList[id];
