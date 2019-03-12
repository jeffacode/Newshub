import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'components/IntlContext';
import map from 'lodash/map';
import {
  fetchNewsList,
  fetchFeedNewsList,
  fetchVotedNewsList,
  fetchSavedNewsList,
  fetchHiddenNewsList,
  clearNewsList,
  fetchCategory,
  voteNews,
  saveNews,
  hideNews,
} from 'redux/modules/newsPanel/action';
import {
  setNavigatorBar,
} from 'redux/modules/app/action';
import {
  getNewsList,
  getCategory,
} from 'redux/modules/newsPanel/reducer';
import views from 'constant/views';
import popularities from 'constant/popularities';
import times from 'constant/times';
import feeds from 'constant/feeds';
import NewsItem from './components/NewsItem';
import NewsHeader from './components/NewsHeader';

class NewsPanel extends Component {
  constructor(props) {
    super(props);
    const {
      match: { params: { cid, profile } },
    } = props;
    this.state = {
      cid,
      profile,
      selectedView: views[0],
      selectedPopularity: popularities[0],
      selectedTime: times[0],
    };
  }

  componentDidMount() {
    const {
      history,
      match: { params: { cid, username, profile } },
      location: { pathname },
      fetchCategory,
      setNavigatorBar,
      fetchNewsList,
      fetchFeedNewsList,
      fetchVotedNewsList,
      fetchSavedNewsList,
      fetchHiddenNewsList,
      clearNewsList,
    } = this.props;

    clearNewsList(); // 清除新闻数据

    // 如果在新闻分类页
    if (cid) {
      // 获取当前分类数据
      fetchCategory(cid)
        .then(({ data: { category } }) => {
          if (category) {
            const { id, icon } = category;
            setNavigatorBar(icon, `c/${id}`); // 设置导航栏内容
          } else {
            // 如果此分类不存在就跳到404
            history.push('/404');
          }
        });
      // 获取当前分类下的所有新闻数据
      fetchNewsList(cid);
    }

    // 如果在用户档案页
    if (profile) {
      setNavigatorBar('user', `u/${username}`); // 设置导航栏内容
      // 获取不同档案页的新闻数据
      switch (profile) {
        case 'upvoted':
          fetchVotedNewsList(1);
          break;
        case 'downvoted':
          fetchVotedNewsList(-1);
          break;
        case 'saved':
          fetchSavedNewsList();
          break;
        case 'hidden':
          fetchHiddenNewsList();
          break;
        default:
          // 不是上述任意一个选项就跳到404
          history.push('/404');
      }
    }

    // 如果在新闻推送页
    switch (pathname) {
      case '/home':
        setNavigatorBar(feeds[0].icon, feeds[0].id); // 设置导航栏内容
        fetchFeedNewsList('home'); // 获取当前推送栏目的新闻数据
        break;
      case '/popular':
        setNavigatorBar(feeds[1].icon, feeds[1].id);
        fetchFeedNewsList('popular');
        break;
      case '/all':
        setNavigatorBar(feeds[2].icon, feeds[2].id);
        fetchFeedNewsList('all');
        break;
      default:
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      match: { params: { cid, profile } },
      fetchCategory,
      fetchNewsList,
      fetchVotedNewsList,
      fetchSavedNewsList,
      fetchHiddenNewsList,
      setNavigatorBar,
      clearNewsList,
    } = nextProps;

    // 如果在新闻分类页
    if (cid !== prevState.cid) {
      clearNewsList(); // 必须先清除新闻数据
      fetchCategory(cid)
        .then(({ data: { category } }) => {
          const { id, icon } = category;
          setNavigatorBar(icon, `c/${id}`);
        });
      fetchNewsList(cid);
      return { cid };
    }

    // 如果在用户档案页
    if (profile !== prevState.profile) {
      clearNewsList(); // 必须先清除新闻数据
      switch (profile) {
        case 'upvoted':
          fetchVotedNewsList(1);
          break;
        case 'downvoted':
          fetchVotedNewsList(-1);
          break;
        case 'saved':
          fetchSavedNewsList();
          break;
        case 'hidden':
          fetchHiddenNewsList();
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

  selectPopularity = (popularity) => {
    this.setState({
      selectedPopularity: popularity,
    });
  }

  selectTime = (time) => {
    this.setState({
      selectedTime: time,
    });
  }

  render() {
    const {
      match: { params: { cid } },
      location: { pathname },
      category,
      newsList,
      voteNews,
      saveNews,
      hideNews,
      intl,
      history,
    } = this.props;
    const {
      selectedView,
      selectedPopularity,
      selectedTime,
    } = this.state;
    return (
      <div className="newsPanel">
        <NewsHeader
          cid={cid}
          category={category}
          selectedView={selectedView}
          selectedPopularity={selectedPopularity}
          selectedTime={selectedTime}
          selectView={this.selectView}
          selectPopularity={this.selectPopularity}
          selectTime={this.selectTime}
          intl={intl}
        />
        {map(newsList, (news) => {
          const { id, hidden } = news;

          // 在新闻分类页且已隐藏时不显示
          if (cid && hidden) {
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
              intl={intl}
              history={history}
            />
          );
        })}
      </div>
    );
  }
}

NewsPanel.propTypes = {
  category: PropTypes.object.isRequired,
  newsList: PropTypes.array.isRequired,
  fetchCategory: PropTypes.func.isRequired,
  setNavigatorBar: PropTypes.func.isRequired,
  fetchNewsList: PropTypes.func.isRequired,
  fetchFeedNewsList: PropTypes.func.isRequired,
  fetchVotedNewsList: PropTypes.func.isRequired,
  fetchSavedNewsList: PropTypes.func.isRequired,
  fetchHiddenNewsList: PropTypes.func.isRequired,
  clearNewsList: PropTypes.func.isRequired,
  voteNews: PropTypes.func.isRequired,
  saveNews: PropTypes.func.isRequired,
  hideNews: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  category: getCategory(state),
  newsList: getNewsList(state),
});

const mapDispatchToProps = {
  fetchCategory,
  setNavigatorBar,
  fetchNewsList,
  fetchFeedNewsList,
  fetchVotedNewsList,
  fetchSavedNewsList,
  fetchHiddenNewsList,
  clearNewsList,
  voteNews,
  saveNews,
  hideNews,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewsPanel));
