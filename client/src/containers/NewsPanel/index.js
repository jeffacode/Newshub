import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'components/IntlContext';
import map from 'lodash/map';
import {
  // getIsLogin, // 一些功能需要登录才能操作
  getSelectedView, // 根据选择的视图切换
} from 'redux/modules/app/reducer';
import {
  getNews,
} from 'redux/modules/newsPanel/reducer';
import { setNavigatorBar } from 'redux/modules/app/action';
import {
  fetchNews,
  clearNews,
  fetchCategory,
  voteNews,
  saveNews,
  hideNews,
} from 'redux/modules/newsPanel/action';
import NewsItem from './components/NewsItem';
import './style.scss';

class NewsPanel extends Component {
  constructor(props) {
    super(props);
    const { match: { params } } = props;
    const {
      category,
      subCategory,
    } = params;
    this.state = {
      category,
      subCategory,
    };
  }

  componentDidMount() {
    const {
      match: { params },
      fetchNews,
      clearNews,
      fetchCategory,
      setNavigatorBar,
    } = this.props;
    const {
      category,
      username,
      subCategory,
    } = params;

    // 清除新闻数据
    clearNews();

    // 在新闻分类页
    if (category) {
      // 获取分类信息
      fetchCategory(category);
      // 获取新闻数据
      fetchNews({ category });
    }

    // 在用户档案页
    if (subCategory) {
      setNavigatorBar('user', `/u/${username}`); // 应该是获取用户信息，这边比较简略
      // 获取新闻数据
      switch (subCategory) {
        case 'saved':
          fetchNews({ saved: true });
          break;
        case 'hidden':
          fetchNews({ hidden: true });
          break;
        case 'upvoted':
          fetchNews({ voted: 1 });
          break;
        case 'downvoted':
          fetchNews({ voted: -1 });
          break;
        default:
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      match: { params },
      fetchNews,
      clearNews,
      fetchCategory,
    } = nextProps;
    const {
      category,
      subCategory,
    } = params;

    if (category !== prevState.category) {
      clearNews();
      fetchNews({ category });
      fetchCategory(category);
      return { category };
    }

    if (subCategory !== prevState.subCategory) {
      clearNews();
      switch (subCategory) {
        case 'saved':
          fetchNews({ saved: true });
          break;
        case 'hidden':
          fetchNews({ hidden: true });
          break;
        case 'upvoted':
          fetchNews({ voted: 1 });
          break;
        case 'downvoted':
          fetchNews({ voted: -1 });
          break;
        default:
      }
      return { subCategory };
    }
    return null;
  }

  render() {
    const {
      news,
      view: { type },
      voteNews,
      saveNews,
      hideNews,
      intl,
    } = this.props;
    const { category } = this.state;
    return (
      <div className="newsPanel">
        {map(news, (item) => {
          const { id, hidden } = item;
          if (category && hidden) { // 只有在新闻分类页且已隐藏时才不显示
            return null;
          }
          return (
            <NewsItem
              key={id}
              type={type}
              item={item}
              voteNews={voteNews}
              saveNews={saveNews}
              hideNews={hideNews}
              intl={intl}
            />
          );
        })}
      </div>
    );
  }
}

NewsPanel.propTypes = {
  news: PropTypes.array.isRequired,
  view: PropTypes.object.isRequired,
  fetchNews: PropTypes.func.isRequired,
  clearNews: PropTypes.func.isRequired,
  fetchCategory: PropTypes.func.isRequired,
  voteNews: PropTypes.func.isRequired,
  saveNews: PropTypes.func.isRequired,
  hideNews: PropTypes.func.isRequired,
  setNavigatorBar: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  news: getNews(state),
  view: getSelectedView(state),
});

const mapDispatchToProps = {
  fetchNews,
  clearNews,
  fetchCategory,
  voteNews,
  saveNews,
  hideNews,
  setNavigatorBar,
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewsPanel));
