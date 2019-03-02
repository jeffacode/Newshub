import createAsyncActionTypes from 'utils/createAsyncActionTypes';

const MODULE = 'NEWS_PANEL';

const actionTypes = {
  fetchNews: createAsyncActionTypes(MODULE, 'FETCH_NEWS'), // 获取新闻数据
  clearNews: `${MODULE}/CLEAR_NEWS`, // 清除新闻数据
  fetchCategory: createAsyncActionTypes(MODULE, 'FETCH_CATEGORY'), // 获取分类
  voteNews: createAsyncActionTypes(MODULE, 'VOTE_NEWS'), // 请求更改投票数据
  saveNews: createAsyncActionTypes(MODULE, 'SAVE_NEWS'), // 收藏新闻
  hideNews: createAsyncActionTypes(MODULE, 'HIDE_NEWS'), // 隐藏新闻
  changeNews: `${MODULE}/CHANGE_NEWS`, // 更改新闻数据
};

export default actionTypes;
