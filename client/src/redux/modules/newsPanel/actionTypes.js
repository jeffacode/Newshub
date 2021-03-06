import createAsyncActionTypes from 'utils/createAsyncActionTypes';

const MODULE = 'NEWS_PANEL';

const actionTypes = {
  fetchTopicNewsList: createAsyncActionTypes(MODULE, 'FETCH_TOPIC_NEWS_LIST'), // 获取主题新闻数据
  fetchFeedNewsList: createAsyncActionTypes(MODULE, 'FETCH_FEED_NEWS_LIST'), // 获取推送新闻数据
  fetchVotedNewsList: createAsyncActionTypes(MODULE, 'FETCH_VOTED_NEWS_LIST'), // 获取用户投票过的新闻数据
  fetchSavedNewsList: createAsyncActionTypes(MODULE, 'FETCH_SAVED_NEWS_LIST'), // 获取用户收藏过的新闻数据
  fetchHiddenNewsList: createAsyncActionTypes(MODULE, 'FETCH_HIDDEN_NEWS_LIST'), // 获取用户隐藏过的新闻数据
  clearNewsList: `${MODULE}/CLEAR_NEWS_LIST`, // 清除新闻数据
  fetchTopic: createAsyncActionTypes(MODULE, 'FETCH_TOPIC'), // 获取主题
  voteNews: createAsyncActionTypes(MODULE, 'VOTE_NEWS'), // 投票
  saveNews: createAsyncActionTypes(MODULE, 'SAVE_NEWS'), // 收藏
  hideNews: createAsyncActionTypes(MODULE, 'HIDE_NEWS'), // 隐藏
  sendClickLog: createAsyncActionTypes(MODULE, 'SEND_CLICK_LOG'), // 创建点击日志
  changeNewsById: `${MODULE}/CHANGE_NEWS_BY_ID`, // 更改新闻数据
  changePage: `${MODULE}/CHANGE_PAGE`, // 更改当前页码
};

export default actionTypes;
