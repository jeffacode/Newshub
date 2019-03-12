export const schema = {
  name: 'category',
  id: 'id',
};

const initialState = {};

const reducer = (state = initialState, action) => {
  if (action.data && action.data[schema.name]) {
    return action.data[schema.name];
  }
  return state;
};

export default reducer;
