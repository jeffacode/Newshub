import actionTypes from '../newsPanel/actionTypes';

export const schema = {
  name: 'news',
  id: 'id',
};

const initialState = {};

const reducer = (state = initialState, action) => {
  if (action.response && action.response[schema.name]) {
    return {
      ...state,
      ...action.response[schema.name],
    };
  }

  if (action.type === actionTypes.changeNews) {
    const { id, data } = action.payload;
    return {
      ...state,
      [id]: {
        ...state[id],
        ...data,
      },
    };
  }

  if (action.type === actionTypes.clearNews) {
    return initialState;
  }
  return state;
};

export default reducer;

// selector
export const getNewsById = (state, id) => state.entities.news[id];
