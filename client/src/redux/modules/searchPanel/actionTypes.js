import createAsyncActionTypes from 'utils/createAsyncActionTypes';

const MODULE = 'SEARCH_PANEL';

const actionTypes = {
  fetchSearchResults: createAsyncActionTypes(MODULE, 'FETCH_SEARCH_RESULTS'), // 获取搜索结果
  clearSearchResults: `${MODULE}/CLEAR_SEARCH_RESULTS`, // 清除搜索结果
  changeSearchResultByTid: `${MODULE}/CHANGE_SEARCH_RESULT_BY_TID`, // 更改搜索结果
  subscribe: createAsyncActionTypes(MODULE, 'SUBSCRIBE'), // 订阅
  unsubscribe: createAsyncActionTypes(MODULE, 'UNSUBSCRIBE'), // 取消订阅
};

export default actionTypes;
