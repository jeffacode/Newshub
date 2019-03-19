export default {
  login: () => '/auth/login', // POST
  signup: () => '/auth/signup', // POST
  fetchNotices: () => '/v1/notices', // GET
  deleteNotice: id => `/v1/notices/${id}`, // DELETE
  fetchSubscriptions: () => '/v1/subscriptions', // GET
  subscribe: () => '/v1/subscriptions', // POST
  unsubscribe: tid => `/v1/subscriptions/${tid}`, // DELETE
  fetchSearchResults: searchQuery => `/v1/search${searchQuery}`, // GET
  fetchTopic: tid => `/v1/topic?tid=${tid}`, // GET 根据query tid来判断是哪个主题的数据
  fetchTopicNewsList: () => '/v1/topicNews', // GET 根据query tid来判断取哪个主题的新闻
  fetchFeedNewsList: () => '/v1/feedNews', // GET 根据query feed来判断取哪个推送栏目的新闻
  fetchVotedNewsList: () => '/v1/votedNews', // GET 根据query v来判断取的是upvoted还是downvoted
  fetchSavedNewsList: () => '/v1/savedNews', // GET
  fetchHiddenNewsList: () => '/v1/hiddenNews', // GET
  voteNews: () => '/v1/votedNews', // POST body带上state字段，upvote是1，downvote是-1
  saveNews: () => '/v1/savedNews', // POST
  hideNews: () => '/v1/hiddenNews', // POST
  sendClickLog: () => '/v1/clickLog', // POST
};
