export const schema = {
  name: 'category',
  id: 'category_id',
};

const initialState = {};

const reducer = (state = initialState, action) => {
  if (action.data && action.data[schema.name]) {
    return action.data[schema.name];
  }
  return state;
};

export default reducer;
