import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import getTime, { padLeft } from 'utils/getTime';
import formatNumber from 'utils/formatNumber';
import {
  Icon,
  Menu,
  Dropdown,
} from 'antd';
import './style.scss';

const formatPublishedTime = (publishedTime) => {
  if (!publishedTime) {
    return '';
  }
  try {
    const {
      year, month, date, hour, minutes,
    } = getTime(publishedTime);
    return `${year}-${padLeft(month)}-${padLeft(date)} ${padLeft(hour)}:${padLeft(minutes)}`;
  } catch {
    return '';
  }
};

const strategies = {
  [-1]: {
    1: [1, 2],
    [-1]: [0, 1],
  },
  0: {
    1: [1, 1],
    [-1]: [-1, -1],
  },
  1: {
    1: [0, -1],
    [-1]: [-1, -2],
  },
};

class NewsItem extends Component {
  constructor(props) {
    super(props);
    const { item: { voted } } = props;
    this.state = {
      prevVoted: voted,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { item: { voted } } = nextProps;
    if (voted !== prevState.prevVoted) {
      return {
        prevVoted: voted, // 只有数据中的voted变化了才去更新state
      };
    }
    return null;
  }

  voteNews = (e, id, state) => {
    e.stopPropagation();
    const { item: { votes }, voteNews } = this.props;
    const { prevVoted } = this.state;
    const strategy = strategies[prevVoted][state];
    voteNews(id, {
      votes: votes + strategy[1],
      voted: strategy[0],
    });
  }

  shareNews = (e, id) => {
    e.stopPropagation();
    console.log(id); // 跳弹窗
  }

  saveNews = (e, id) => {
    e.stopPropagation();
    const { saveNews, item: { saved } } = this.props;
    saveNews(id, {
      saved: !saved,
    });
  }

  hideNews = (e, id) => {
    e.stopPropagation();
    const { hideNews, item: { hidden } } = this.props;
    hideNews(id, {
      hidden: !hidden,
    });
  }

  reportNews = (e, id) => {
    e.stopPropagation();
    console.log(id); // 跳弹窗
  }

  renderNewsItemBtns = () => {
    const { item, intl } = this.props;
    const { id, saved, hidden } = item;

    return (
      <div className="newsItem_btns">
        <span
          className="newsItem__btn pd-5"
          onClick={e => this.shareNews(e, id)}
          role="presentation"
        >
          <Icon type="share-alt" />
          <span className="ml-5">{intl.formatMessage({ id: 'newsItem_share' })}</span>
        </span>
        <span
          className="newsItem__btn ml-20 pd-5"
          onClick={e => this.saveNews(e, id)}
          role="presentation"
        >
          <Icon
            type={saved ? 'check-square' : 'plus-square'}
            theme={saved ? 'filled' : 'outlined'}
          />
          <span className="ml-5">
            {intl.formatMessage({ id: saved ? 'newsItem_saved' : 'newsItem_save' })}
          </span>
        </span>
        <span
          className="newsItem__btn ml-20 pd-5"
          onClick={e => this.hideNews(e, id)}
          role="presentation"
        >
          <Icon
            type={hidden ? 'eye-invisible' : 'eye'}
            theme={hidden ? 'filled' : 'outlined'}
          />
          <span className="ml-5">
            {intl.formatMessage({ id: hidden ? 'newsItem_hidden' : 'newsItem_hide' })}
          </span>
        </span>
        <span
          className="newsItem__btn ml-20 pd-5"
          onClick={e => this.reportNews(e, id)}
          role="presentation"
        >
          <Icon type="flag" />
          <span className="ml-5">{intl.formatMessage({ id: 'newsItem_report' })}</span>
        </span>
      </div>
    );
  }

  renderNewsItemDropdownBtn = () => {
    const { item, intl } = this.props;
    const { id, saved, hidden } = item;
    const menu = (
      <Menu>
        <Menu.Item>
          <div
            onClick={e => this.shareNews(e, id)}
            role="presentation"
          >
            <Icon type="share-alt" />
            <span className="ml-5">{intl.formatMessage({ id: 'newsItem_share' })}</span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div
            onClick={e => this.saveNews(e, id)}
            role="presentation"
          >
            <Icon
              type={saved ? 'check-square' : 'plus-square'}
              theme={saved ? 'filled' : 'outlined'}
            />
            <span className="ml-5">
              {intl.formatMessage({ id: saved ? 'newsItem_saved' : 'newsItem_save' })}
            </span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div
            onClick={e => this.hideNews(e, id)}
            role="presentation"
          >
            <Icon
              type={hidden ? 'eye-invisible' : 'eye'}
              theme={hidden ? 'filled' : 'outlined'}
            />
            <span className="ml-5">
              {intl.formatMessage({ id: hidden ? 'newsItem_hidden' : 'newsItem_hide' })}
            </span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div
            onClick={e => this.reportNews(e, id)}
            role="presentation"
          >
            <Icon type="flag" />
            <span className="ml-5">{intl.formatMessage({ id: 'newsItem_report' })}</span>
          </div>
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <div
          className="newsItem__btns"
          onClick={e => e.stopPropagation()}
          role="presentation"
        >
          <Icon type="ellipsis" />
        </div>
      </Dropdown>
    );
  }

  renderRightContentWithCardView = () => {
    const { item, intl } = this.props;
    const {
      id,
      source: { name },
      title,
      description,
      author,
      publishedAt,
      urlToImage,
    } = item;
    const formattedPublishedTime = formatPublishedTime(publishedAt);

    return (
      <div className="newsItem__rightContent">
        <div className="newsItem__source">{name}</div>
        <h2 className="newsItem__title ft-bold">{title}</h2>
        <div className="newsItem__desc mb-5">{description}</div>
        <div className="newsItem__img mb-5">
          <img src={urlToImage} alt={urlToImage} />
        </div>
        <div className="newsItem__author">
          {intl.formatMessage({ id: 'newsItem_author' })}
          <span className="ml-5">{author}</span>
        </div>
        <div className="newsItem__time mb-5">
          {intl.formatMessage({ id: 'newsItem_published' })}
          <span className="ml-5">{formattedPublishedTime}</span>
        </div>
        {this.renderNewsItemBtns(id)}
      </div>
    );
  }

  renderRightContentWithClassicView = () => {
    const { item, intl } = this.props;
    const {
      id,
      source: { name },
      title,
      author,
      publishedAt,
      urlToImage,
    } = item;
    const formattedPublishedTime = formatPublishedTime(publishedAt);

    return (
      <div className="newsItem__rightContent">
        <div className="newsItem__img">
          <img src={urlToImage} alt={urlToImage} />
        </div>
        <div className="pl-5">
          <h3 className="newsItem__title ft-bold">{title}</h3>
          <div className="newsItem__source">
            {intl.formatMessage({ id: 'newsItem_from' })}
            {name}
          </div>
          <div className="newsItem__author">
            {intl.formatMessage({ id: 'newsItem_author' })}
            <span className="ml-5">{author}</span>
          </div>
          <div className="newsItem__time mb-5">
            {intl.formatMessage({ id: 'newsItem_published' })}
            <span className="ml-5">{formattedPublishedTime}</span>
          </div>
          {this.renderNewsItemBtns(id)}
        </div>
      </div>
    );
  }

  renderRightContentWithCompactView = () => {
    const { item, intl } = this.props;
    const {
      id,
      source: { name },
      title,
      author,
      publishedAt,
    } = item;
    const formattedPublishedTime = formatPublishedTime(publishedAt);

    return (
      <div className="newsItem__rightContent">
        <div className="newsItem__mainContent">
          <h4 className="newsItem__title ft-bold">{title}</h4>
          <div className="newsItem__source">
            {intl.formatMessage({ id: 'newsItem_from' })}
            {name}
          </div>
          <div className="newsItem__author">
            {intl.formatMessage({ id: 'newsItem_author' })}
            <span className="ml-5">{author}</span>
          </div>
          <div className="newsItem__time">
            {intl.formatMessage({ id: 'newsItem_published' })}
            <span className="ml-5">{formattedPublishedTime}</span>
          </div>
        </div>
        {this.renderNewsItemDropdownBtn(id)}
      </div>
    );
  }

  renderLeftContent = () => {
    const {
      item: { id, votes, voted },
    } = this.props;
    const upvoteClassNames = classnames({
      newsItem__upvote: true,
      voted: voted === 1,
    });
    const votesClassNames = classnames({
      newsItem__votes: true,
      upvoted: voted === 1,
      downvoted: voted === -1,
    });
    const downvoteClassNames = classnames({
      newsItem__downvote: true,
      voted: voted === -1,
    });

    return (
      <div className="newsItem__leftContent">
        <div
          className={upvoteClassNames}
          onClick={e => this.voteNews(e, id, 1)}
          role="presentation"
        >
          <Icon type="caret-up" />
        </div>
        <div className={votesClassNames}>{formatNumber(votes)}</div>
        <div
          className={downvoteClassNames}
          onClick={e => this.voteNews(e, id, -1)}
          role="presentation"
        >
          <Icon type="caret-down" />
        </div>
      </div>
    );
  }

  onNewsItemClick = (url) => {
    window.open(url);
  }

  render() {
    const { type, item } = this.props;
    const { url } = item;
    const classNames = classnames({
      newsItem: true,
      [type]: true,
    });

    return (
      <div
        className={classNames}
        onClick={() => this.onNewsItemClick(url)}
        role="presentation"
      >
        {this.renderLeftContent()}
        {type === 'card' && this.renderRightContentWithCardView()}
        {type === 'classic' && this.renderRightContentWithClassicView()}
        {type === 'compact' && this.renderRightContentWithCompactView()}
      </div>
    );
  }
}

NewsItem.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  voteNews: PropTypes.func.isRequired,
  saveNews: PropTypes.func.isRequired,
  hideNews: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default NewsItem;
