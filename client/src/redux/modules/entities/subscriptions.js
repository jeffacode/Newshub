import actionTypes from '../app/actionTypes';

export const schema = {
  name: 'subscriptions',
  id: 'category_id',
};

const initialState = {};

const reducer = (state = initialState, action) => {
  if (action.data && action.data[schema.name]) {
    return action.data[schema.name];
  }

  if (action.type === actionTypes.clearSubscriptionByCid) {
    const cid = action.payload;
    delete state[cid];
    return { ...state };
  }

  if (action.type === actionTypes.clearSubscriptions) {
    return initialState;
  }
  return state;
};

export default reducer;
