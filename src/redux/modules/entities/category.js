export const schema = {
  name: 'category',
  id: 'name',
};

const initialState = {};

const reducer = (state = initialState, action) => {
  if (action.response && action.response[schema.name]) {
    return action.response[schema.name];
  }
  return state;
};

export default reducer;
