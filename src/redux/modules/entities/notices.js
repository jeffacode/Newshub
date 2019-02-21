export const schema = {
  name: 'notices', // 领域实体的名称
  id: 'id', // 领域实体的索引字段
};

const reducer = (state = {}, action) => {
  if (action.response && action.response.notices) {
    return action.response.notices; // 通知数据并不是分页获取的，因此直接覆盖旧数据
  }
  return state;
};

export default reducer;
