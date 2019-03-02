import actionTypes from '../app/actionTypes';

export const schema = {
  name: 'notices', // 领域实体的名称
  id: 'id', // 领域实体的索引字段
};

const initialState = {};

const reducer = (state = initialState, action) => {
  if (action.response && action.response[schema.name]) {
    return action.response[schema.name]; // 通知数据并不是分页获取的，因此直接覆盖旧数据
  }
  // 登出时恢复到初始状态
  if (action.type === actionTypes.clearNotices) {
    return initialState;
  }
  return state;
};

export default reducer;
