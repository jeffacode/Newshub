import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import getTime, { padLeft } from 'utils/getTime';
import formatNumber from 'utils/formatNumber';
import {
  Icon,
  Menu,
  Dropdown,
  Tag,
  Tooltip,
  Modal,
  Select,
  Input,
} from 'antd';
import './style.scss';

const { Option } = Select;
const { TextArea } = Input;

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

class NewsItem extends Component {
  state = {
    isShareModalVisible: false,
    isReportModalVisible: false,
  }

  voteNews = (e, state) => {
    e.stopPropagation();
    const { news: { id, votes, voted }, voteNews } = this.props;
    voteNews(id, votes, voted, state);
  }

  saveNews = (e) => {
    e.stopPropagation();
    const { saveNews, news: { id, saved } } = this.props;
    saveNews(id, !saved);
  }

  hideNews = (e) => {
    e.stopPropagation();
    const { hideNews, news: { id, hidden } } = this.props;
    hideNews(id, !hidden);
  }

  onNewsItemClick = (id, url) => {
    const { sendClickLog } = this.props;
    sendClickLog(id);
    window.open(url, '_blank');
  }

  showShareNewsModal = (e) => {
    e.stopPropagation();
    this.setState({
      isShareModalVisible: true,
    });
  }

  onShareNewsOk = (e) => {
    e.stopPropagation();
    this.setState({
      isShareModalVisible: false,
    });
  }

  onShareNewsCancel = (e) => {
    e.stopPropagation();
    this.setState({
      isShareModalVisible: false,
    });
  }

  showReportNewsModal = (e) => {
    e.stopPropagation();
    this.setState({
      isReportModalVisible: true,
    });
  }

  onReportNewsOk = (e) => {
    e.stopPropagation();
    this.setState({
      isReportModalVisible: false,
    });
  }

  onReportNewsCancel = (e) => {
    e.stopPropagation();
    this.setState({
      isReportModalVisible: false,
    });
  }

  onReportTopicSelected = (val) => {
    console.log(val);
  }

  renderShareNewsModal = () => {
    const { isShareModalVisible } = this.state;
    const { news: { title }, intl } = this.props;
    return (
      <Modal
        title={intl.formatMessage({ id: 'modal_share_title' })}
        visible={isShareModalVisible}
        okText={intl.formatMessage({ id: 'modal_share_ok' })}
        cancelText={intl.formatMessage({ id: 'modal_cancel' })}
        onOk={this.onShareNewsOk}
        onCancel={this.onShareNewsCancel}
      >
        <div className="newsItem__shareModal__title">{title}</div>
        <div className="newsItem__shareModal__content">
          <div className="newsItem__shareModal__icon">
            <Tooltip title={intl.formatMessage({ id: 'modal_share_weibo' })}>
              <Icon type="weibo" />
            </Tooltip>
          </div>
          <div className="newsItem__shareModal__icon">
            <Tooltip title={intl.formatMessage({ id: 'modal_share_wechat' })}>
              <Icon type="wechat" />
            </Tooltip>
          </div>
          <div className="newsItem__shareModal__icon">
            <Tooltip title={intl.formatMessage({ id: 'modal_share_qq' })}>
              <Icon type="qq" />
            </Tooltip>
          </div>
          <div className="newsItem__shareModal__icon">
            <Tooltip title={intl.formatMessage({ id: 'modal_share_twitter' })}>
              <Icon type="twitter" />
            </Tooltip>
          </div>
        </div>
      </Modal>
    );
  }

  renderReportNewsModal = () => {
    const { isReportModalVisible } = this.state;
    const { intl } = this.props;
    return (
      <Modal
        title={intl.formatMessage({ id: 'modal_report_title' })}
        visible={isReportModalVisible}
        okText={intl.formatMessage({ id: 'modal_report_ok' })}
        cancelText={intl.formatMessage({ id: 'modal_cancel' })}
        onOk={this.onReportNewsOk}
        onCancel={this.onReportNewsCancel}
      >
        <div className="newsItem__reportModal__notice mb-10">
          {intl.formatMessage({ id: 'modal_report_notice' })}
        </div>
        <div className="newsItem__reportModal__select mb-10">
          <Select
            defaultValue={intl.formatMessage({ id: 'modal_reportOption_default' })}
            style={{ width: '100%' }}
            onSelect={this.onReportTopicSelected}
          >
            <Option value="spam">
              <Icon type="warning" className="mr-10" />
              {intl.formatMessage({ id: 'modal_reportOption_spam' })}
            </Option>
            <Option value="abuse">
              <Icon type="frown" className="mr-10" />
              {intl.formatMessage({ id: 'modal_reportOption_abuse' })}
            </Option>
            <Option value="copyright">
              <Icon type="exception" className="mr-10" />
              {intl.formatMessage({ id: 'modal_reportOption_copyright' })}
            </Option>
            <Option value="others">
              <Icon type="question-circle" className="mr-10" />
              {intl.formatMessage({ id: 'modal_reportOption_others' })}
            </Option>
          </Select>
        </div>
        <div className="newsItem__reportModal__input">
          <TextArea
            defaultValue={intl.formatMessage({ id: 'modal_reportText_default' })}
            style={{ height: 100 }}
          />
        </div>
      </Modal>
    );
  }

  renderNewsItemBtns = () => {
    const { news, intl } = this.props;
    const { saved, hidden } = news;

    return (
      <div className="newsItem_btns">
        <span
          className="newsItem__btn pd-5"
          onClick={this.showShareNewsModal}
          role="presentation"
        >
          <Icon type="share-alt" />
          <span className="ml-5">{intl.formatMessage({ id: 'newsItem_share' })}</span>
        </span>
        <span
          className="newsItem__btn ml-20 pd-5"
          onClick={this.saveNews}
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
          onClick={this.hideNews}
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
          onClick={this.showReportNewsModal}
          role="presentation"
        >
          <Icon type="flag" />
          <span className="ml-5">{intl.formatMessage({ id: 'newsItem_report' })}</span>
        </span>
      </div>
    );
  }

  renderNewsItemDropdownBtn = () => {
    const { news, intl } = this.props;
    const { saved, hidden } = news;
    const menu = (
      <Menu>
        <Menu.Item>
          <div
            onClick={this.showShareNewsModal}
            role="presentation"
          >
            <Icon type="share-alt" />
            <span className="ml-5">{intl.formatMessage({ id: 'newsItem_share' })}</span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div
            onClick={this.saveNews}
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
            onClick={this.hideNews}
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
            onClick={this.showReportNewsModal}
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

  onTagClick = (e) => {
    e.stopPropagation();
    const { news: { topic_id: tid }, history } = this.props;
    history.push(`/c/${tid}`);
  }

  renderRightContentWithCardView = () => {
    const {
      topicIdFromRoute,
      news,
      intl,
    } = this.props;
    const {
      id,
      topic_id: tid,
      recommended,
      source,
      title,
      description,
      author,
      publishedAt,
      urlToImage,
    } = news;
    const formattedPublishedTime = formatPublishedTime(publishedAt);

    return (
      <div className="newsItem__rightContent">
        <div className="newsItem__source">
          <Tag color="#108ee9" onClick={this.onTagClick}>{tid}</Tag>
          {(recommended && recommended !== topicIdFromRoute) && (
            <Tag color="#52c41a" onClick={this.onTagClick}>
              {intl.formatMessage({ id: 'newsItem_recommended' })}
            </Tag>
          )}
          {source}
        </div>
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
    const { news, intl } = this.props;
    const {
      id,
      source,
      title,
      author,
      publishedAt,
      urlToImage,
    } = news;
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
            {source}
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
    const { news, intl } = this.props;
    const {
      id,
      source,
      title,
      author,
      publishedAt,
    } = news;
    const formattedPublishedTime = formatPublishedTime(publishedAt);

    return (
      <div className="newsItem__rightContent">
        <div className="newsItem__mainContent">
          <h4 className="newsItem__title ft-bold">{title}</h4>
          <div className="newsItem__source">
            {intl.formatMessage({ id: 'newsItem_from' })}
            {source}
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
      news: { votes, voted },
    } = this.props;
    const votesClassNames = classnames({
      newsItem__votes: true,
      upvoted: voted === 1,
      downvoted: voted === -1,
    });
    const upvoteClassNames = classnames({
      newsItem__upvote: true,
      voted: voted === 1,
    });
    const downvoteClassNames = classnames({
      newsItem__downvote: true,
      voted: voted === -1,
    });

    return (
      <div className="newsItem__leftContent">
        <div
          className={upvoteClassNames}
          onClick={e => this.voteNews(e, 1)}
          role="presentation"
        >
          <Icon type="caret-up" />
        </div>
        <div className={votesClassNames}>{formatNumber(votes)}</div>
        <div
          className={downvoteClassNames}
          onClick={e => this.voteNews(e, -1)}
          role="presentation"
        >
          <Icon type="caret-down" />
        </div>
      </div>
    );
  }

  render() {
    const { isShareModalVisible, isReportModalVisible } = this.state;
    const { view: { type }, news } = this.props;
    const { id, url } = news;
    const classNames = classnames({
      newsItem: true,
      [type]: true,
    });

    return (
      <Fragment>
        <div
          className={classNames}
          onClick={() => this.onNewsItemClick(id, url)}
          role="presentation"
        >
          {this.renderLeftContent()}
          {type === 'card' && this.renderRightContentWithCardView()}
          {type === 'classic' && this.renderRightContentWithClassicView()}
          {type === 'compact' && this.renderRightContentWithCompactView()}
        </div>
        {isShareModalVisible && this.renderShareNewsModal()}
        {isReportModalVisible && this.renderReportNewsModal()}
      </Fragment>
    );
  }
}

NewsItem.propTypes = {
  topicIdFromRoute: PropTypes.string,
  view: PropTypes.object.isRequired,
  news: PropTypes.object.isRequired,
  voteNews: PropTypes.func.isRequired,
  saveNews: PropTypes.func.isRequired,
  hideNews: PropTypes.func.isRequired,
  sendClickLog: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

NewsItem.defaultProps = {
  topicIdFromRoute: '',
};

export default NewsItem;
