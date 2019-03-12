import actionTypes from '../app/actionTypes';

export const schema = {
  name: 'subscriptions',
  id: 'id',
};

const initialState = {};

const reducer = (state = initialState, action) => {
  if (action.data && action.data[schema.name]) {
    return action.data[schema.name];
  }

  if (action.type === actionTypes.clearSubscriptionById) {
    const id = action.payload;
    delete state[id];
    return { ...state };
  }

  if (action.type === actionTypes.clearSubscriptions) {
    return initialState;
  }
  return state;
};

export default reducer;
