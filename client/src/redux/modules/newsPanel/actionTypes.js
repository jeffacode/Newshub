import createAsyncActionTypes from 'utils/createAsyncActionTypes';

const MODULE = 'NEWS_PANEL';

const actionTypes = {
  fetchNewsList: createAsyncActionTypes(MODULE, 'FETCH_NEWS_LIST'), // 获取分类新闻数据
  fetchFeedNewsList: createAsyncActionTypes(MODULE, 'FETCH_FEED_NEWS_LIST'), // 获取推送新闻数据
  fetchVotedNewsList: createAsyncActionTypes(MODULE, 'FETCH_VOTED_NEWS_LIST'), // 获取用户投票过的新闻数据
  fetchSavedNewsList: createAsyncActionTypes(MODULE, 'FETCH_SAVED_NEWS_LIST'), // 获取用户收藏过的新闻数据
  fetchHiddenNewsList: createAsyncActionTypes(MODULE, 'FETCH_HIDDEN_NEWS_LIST'), // 获取用户隐藏过的新闻数据
  clearNewsList: `${MODULE}/CLEAR_NEWS_LIST`, // 清除新闻数据
  fetchCategory: createAsyncActionTypes(MODULE, 'FETCH_CATEGORY'), // 获取分类
  voteNews: createAsyncActionTypes(MODULE, 'VOTE_NEWS'), // 投票
  saveNews: createAsyncActionTypes(MODULE, 'SAVE_NEWS'), // 收藏
  hideNews: createAsyncActionTypes(MODULE, 'HIDE_NEWS'), // 隐藏
  changeNewsById: `${MODULE}/CHANGE_NEWS_BY_ID`, // 更改新闻数据
};

export default actionTypes;
