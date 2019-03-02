import actionTypes from '../app/actionTypes';

export const schema = {
  name: 'subscriptions',
  id: 'id',
};

const initialState = {};

const reducer = (state = initialState, action) => {
  if (action.response && action.response[schema.name]) {
    return action.response[schema.name];
  }
  if (action.type === actionTypes.clearSubscriptions) {
    return initialState;
  }
  return state;
};

export default reducer;
