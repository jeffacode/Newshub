import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'components/IntlContext';
import map from 'lodash/map';
import {
  fetchTopicNewsList,
  fetchFeedNewsList,
  fetchVotedNewsList,
  fetchSavedNewsList,
  fetchHiddenNewsList,
  clearNewsList,
  fetchTopic,
  voteNews,
  saveNews,
  hideNews,
  sendClickLog,
  changePage,
} from 'redux/modules/newsPanel/action';
import {
  setNavigatorBar,
} from 'redux/modules/app/action';
import {
  getNewsListByPage,
  getHistoryPages,
  getNewsListMetadata,
  getTopic,
  getNewsListIsFetching,
} from 'redux/modules/newsPanel/reducer';
import views from 'constant/views';
import popularities from 'constant/popularities';
import times from 'constant/times';
import feeds from 'constant/feeds';
import getPageFromHash from 'utils/getPageFromHash';
import Loading from 'components/Loading';
import NewsHeader from './components/NewsHeader';
import NewsItem from './components/NewsItem';
import NewsPagination from './components/NewsPagination';

const PAGE_SIZE = 10;
class NewsPanel extends Component {
  constructor(props) {
    super(props);
    const {
      match: { params: { tid, profile } },
    } = props;
    this.myRef = React.createRef();
    this.state = {
      tid,
      profile,
      selectedView: views[0],
      selectedTime: times[2],
      selectedPopularity: popularities[0],
    };
  }

  componentDidMount() {
    const {
      selectedTime,
      selectedPopularity,
    } = this.state;
    const {
      fetchTopic,
      setNavigatorBar,
      fetchTopicNewsList,
      fetchFeedNewsList,
      fetchVotedNewsList,
      fetchSavedNewsList,
      fetchHiddenNewsList,
      clearNewsList,
      history,
      match: { params: { tid, username, profile } },
      location: { pathname, hash },
    } = this.props;

    clearNewsList(); // 清除新闻数据

    // 如果在新闻分类页
    if (tid) {
      // 获取当前分类数据
      fetchTopic(tid)
        .then(({ data: { topic } }) => {
          if (topic) {
            const { icon } = topic;
            setNavigatorBar(icon, `c/${tid}`); // 设置导航栏内容
          } else {
            // 如果此分类不存在就跳到404
            history.push('/404');
          }
        });
      // 获取当前分类下的所有新闻数据
      fetchTopicNewsList({
        tid,
        t: selectedTime.id,
        p: selectedPopularity.id,
        page: hash ? getPageFromHash(hash) : 1,
      });
    }

    // 如果在用户档案页
    if (profile) {
      setNavigatorBar('user', `u/${username}`); // 设置导航栏内容
      // 获取不同档案页的新闻数据
      switch (profile) {
        case 'upvoted':
          fetchVotedNewsList({
            v: 1,
            page: hash ? getPageFromHash(hash) : 1,
          });
          break;
        case 'downvoted':
          fetchVotedNewsList({
            v: -1,
            page: hash ? getPageFromHash(hash) : 1,
          });
          break;
        case 'saved':
          fetchSavedNewsList({
            page: hash ? getPageFromHash(hash) : 1,
          });
          break;
        case 'hidden':
          fetchHiddenNewsList({
            page: hash ? getPageFromHash(hash) : 1,
          });
          break;
        default:
          // 不是上述任意一个选项就跳到404
          history.push('/404');
      }
    }

    // 如果在新闻推送页
    switch (pathname) {
      case '/home':
        // 设置导航栏内容
        setNavigatorBar(feeds[0].icon, feeds[0].id);
        // 获取当前推送栏目的新闻数据
        fetchFeedNewsList({
          feed: 'home',
          page: hash ? getPageFromHash(hash) : 1,
        });
        break;
      case '/popular':
        setNavigatorBar(feeds[1].icon, feeds[1].id);
        fetchFeedNewsList({
          feed: 'popular',
          page: hash ? getPageFromHash(hash) : 1,
        });
        break;
      case '/all':
        setNavigatorBar(feeds[2].icon, feeds[2].id);
        fetchFeedNewsList({
          feed: 'all',
          page: hash ? getPageFromHash(hash) : 1,
        });
        break;
      default:
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      selectedTime,
      selectedPopularity,
    } = prevState;
    const {
      fetchTopic,
      fetchTopicNewsList,
      fetchVotedNewsList,
      fetchSavedNewsList,
      fetchHiddenNewsList,
      setNavigatorBar,
      clearNewsList,
      match: { params: { tid, profile } },
      location: { hash },
    } = nextProps;

    // 如果在新闻分类页
    if (tid !== prevState.tid) {
      clearNewsList(); // 必须先清除新闻数据
      fetchTopic(tid)
        .then(({ data: { topic } }) => {
          const { icon } = topic;
          setNavigatorBar(icon, `c/${tid}`);
        });
      fetchTopicNewsList({
        tid,
        t: selectedTime.id,
        p: selectedPopularity.id,
        page: hash ? getPageFromHash(hash) : 1,
      });
      return { tid };
    }

    // 如果在用户档案页
    if (profile !== prevState.profile) {
      clearNewsList(); // 必须先清除新闻数据
      switch (profile) {
        case 'upvoted':
          fetchVotedNewsList({
            v: 1,
            page: hash ? getPageFromHash(hash) : 1,
          });
          break;
        case 'downvoted':
          fetchVotedNewsList({
            v: -1,
            page: hash ? getPageFromHash(hash) : 1,
          });
          break;
        case 'saved':
          fetchSavedNewsList({
            page: hash ? getPageFromHash(hash) : 1,
          });
          break;
        case 'hidden':
          fetchHiddenNewsList({
            page: hash ? getPageFromHash(hash) : 1,
          });
          break;
        default:
      }
      return { profile };
    }

    return null;
  }

  selectView = (view) => {
    this.setState({
      selectedView: view,
    });
  }

  selectTime = (time) => {
    const { selectedPopularity } = this.state;
    const {
      fetchTopicNewsList,
      clearNewsList,
      match: { params: { tid } },
      location: { hash },
    } = this.props;
    this.setState({
      selectedTime: time,
    }, () => {
      // 如果在新闻分类页
      if (tid) {
        clearNewsList(); // 必须先清除新闻数据
        fetchTopicNewsList({
          tid,
          t: time.id,
          p: selectedPopularity.id,
          page: hash ? getPageFromHash(hash) : 1,
        });
      }
    });
  }

  selectPopularity = (popularity) => {
    const { selectedTime } = this.state;
    const {
      fetchTopicNewsList,
      clearNewsList,
      match: { params: { tid } },
      location: { hash },
    } = this.props;
    this.setState({
      selectedPopularity: popularity,
    }, () => {
      if (tid) {
        clearNewsList();
        fetchTopicNewsList({
          tid,
          t: selectedTime.id,
          p: popularity.id,
          page: hash ? getPageFromHash(hash) : 1,
        });
      }
    });
  }

  onPaginationChange = (currentPage) => {
    const {
      selectedTime,
      selectedPopularity,
    } = this.state;
    const {
      historyPages,
      fetchTopicNewsList,
      fetchFeedNewsList,
      fetchVotedNewsList,
      fetchSavedNewsList,
      fetchHiddenNewsList,
      changePage,
      history,
      match: { params: { tid, profile } },
      location: { pathname },
    } = this.props;
    // 页面滚动到最上方
    this.myRef.current.scrollIntoView();

    // 更新url的hash值
    if (currentPage === 1) {
      history.push(`${pathname}`);
    } else {
      history.push(`${pathname}#${currentPage}`);
    }
    // 当前页不存在才获取增量数据
    if (historyPages.indexOf(currentPage) === -1) {
      // 如果在新闻分类页
      if (tid) {
        fetchTopicNewsList({
          tid,
          t: selectedTime.id,
          p: selectedPopularity.id,
          page: currentPage,
        });
      }

      // 如果在用户档案页
      if (profile) {
        switch (profile) {
          case 'upvoted':
            fetchVotedNewsList({
              v: 1,
              page: currentPage,
            });
            break;
          case 'downvoted':
            fetchVotedNewsList({
              v: -1,
              page: currentPage,
            });
            break;
          case 'saved':
            fetchSavedNewsList({
              page: currentPage,
            });
            break;
          case 'hidden':
            fetchHiddenNewsList({
              page: currentPage,
            });
            break;
          default:
        }
      }

      // 如果在新闻推送页
      switch (pathname) {
        case '/home':
          fetchFeedNewsList({
            feed: 'home',
            page: currentPage,
          });
          break;
        case '/popular':
          fetchFeedNewsList({
            feed: 'popular',
            page: currentPage,
          });
          break;
        case '/all':
          fetchFeedNewsList({
            feed: 'all',
            page: currentPage,
          });
          break;
        default:
      }
    } else {
      // 否则只更新当前页码
      changePage(currentPage);
    }
  }

  render() {
    const {
      isFetching,
      topic,
      newsListByPage,
      newsListMetadata: { page, total },
      voteNews,
      saveNews,
      hideNews,
      sendClickLog,
      intl,
      history,
      match: { params: { tid } },
      location: { pathname },
    } = this.props;
    const {
      selectedView,
      selectedTime,
      selectedPopularity,
    } = this.state;
    if (isFetching) {
      return <Loading />;
    }
    return (
      <div className="newsPanel" ref={this.myRef}>
        <NewsHeader
          tid={tid}
          topic={topic}
          selectedView={selectedView}
          selectedTime={selectedTime}
          selectedPopularity={selectedPopularity}
          selectView={this.selectView}
          selectPopularity={this.selectPopularity}
          selectTime={this.selectTime}
          intl={intl}
        />
        {map(newsListByPage, (news) => {
          const { id, hidden } = news;

          // 在新闻分类页且已隐藏时不显示
          if (tid && hidden) {
            return null;
          }

          // 在新闻推送页且已隐藏时不显示
          if (hidden && (
            pathname === '/home'
            || pathname === '/popular'
            || pathname === '/all'
          )) {
            return null;
          }

          return (
            <NewsItem
              key={id}
              view={selectedView}
              news={news}
              voteNews={voteNews}
              saveNews={saveNews}
              hideNews={hideNews}
              sendClickLog={sendClickLog}
              intl={intl}
              history={history}
            />
          );
        })}
        <NewsPagination
          pageSize={PAGE_SIZE}
          page={page}
          total={total}
          onPaginationChange={this.onPaginationChange}
        />
      </div>
    );
  }
}

NewsPanel.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  topic: PropTypes.object.isRequired,
  newsListByPage: PropTypes.array.isRequired,
  historyPages: PropTypes.array.isRequired,
  newsListMetadata: PropTypes.object.isRequired,
  fetchTopic: PropTypes.func.isRequired,
  setNavigatorBar: PropTypes.func.isRequired,
  fetchTopicNewsList: PropTypes.func.isRequired,
  fetchFeedNewsList: PropTypes.func.isRequired,
  fetchVotedNewsList: PropTypes.func.isRequired,
  fetchSavedNewsList: PropTypes.func.isRequired,
  fetchHiddenNewsList: PropTypes.func.isRequired,
  clearNewsList: PropTypes.func.isRequired,
  voteNews: PropTypes.func.isRequired,
  saveNews: PropTypes.func.isRequired,
  hideNews: PropTypes.func.isRequired,
  sendClickLog: PropTypes.func.isRequired,
  changePage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isFetching: getNewsListIsFetching(state),
  topic: getTopic(state),
  newsListByPage: getNewsListByPage(state),
  historyPages: getHistoryPages(state),
  newsListMetadata: getNewsListMetadata(state),
});

const mapDispatchToProps = {
  fetchTopic,
  setNavigatorBar,
  fetchTopicNewsList,
  fetchFeedNewsList,
  fetchVotedNewsList,
  fetchSavedNewsList,
  fetchHiddenNewsList,
  clearNewsList,
  voteNews,
  saveNews,
  hideNews,
  sendClickLog,
  changePage,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewsPanel));
