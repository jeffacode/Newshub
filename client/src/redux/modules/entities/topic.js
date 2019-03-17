export const schema = {
  name: 'topic',
  id: 'topic_id',
};

const initialState = {};

const reducer = (state = initialState, action) => {
  if (action.data && action.data[schema.name]) {
    return action.data[schema.name];
  }
  return state;
};

export default reducer;
