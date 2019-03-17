import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import map from 'lodash/map';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import iconStyles from 'constant/iconStyles';
import SearchHistory from 'utils/SearchHistory';
import parseSearchQuery from 'utils/parseSearchQuery';
import feeds from 'constant/feeds';
import { Input, Icon, Popover } from 'antd';
import './style.scss';

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.navigator = React.createRef();
    this.search = React.createRef();
    const defaultSearchKeyword = parseSearchQuery(props.searchQuery).q;
    if (defaultSearchKeyword) { // 如果存在
      if (SearchHistory.searchHistoryExisted()) {
        const searchHistory = SearchHistory.getSearchHistory();
        if (defaultSearchKeyword !== searchHistory[0]) {
          SearchHistory.storeSearchHistory([
            defaultSearchKeyword,
            ...searchHistory,
          ]);
        }
      } else {
        SearchHistory.storeSearchHistory([this.defaultSearchKeyword]);
      }
    }
    this.state = {
      showNavigatorDropdown: false,
      navigatorFilterKeyword: '',
      searchKeyword: defaultSearchKeyword || '',
      searchHistory: SearchHistory.searchHistoryExisted() ? SearchHistory.getSearchHistory() : [],
      showSearchHistory: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.hideNavigatorDropdown);
    document.addEventListener('click', this.hideSearchHistory);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideNavigatorDropdown);
    document.removeEventListener('click', this.hideSearchHistory);
  }

  switchNavigatorDropdown = () => {
    this.setState(prevState => ({
      showNavigatorDropdown: !prevState.showNavigatorDropdown,
    }));
  }

  hideNavigatorDropdown = (e) => {
    const { showNavigatorDropdown } = this.state;
    // 只有在导航栏显示时才进一步处理，避免没必要的重绘
    if (showNavigatorDropdown) {
      // 当前点击区域不在navigator中
      if (!this.navigator.current.contains(e.target)) {
        this.setState({
          showNavigatorDropdown: false,
        });
      }
    }
  }

  onNavigatorFilterChange = (e) => {
    this.setState({
      navigatorFilterKeyword: e.target.value,
    });
  }

  unsubscribe = (e, tid) => {
    e.stopPropagation(); // 阻止事件冒泡
    const { unsubscribe } = this.props;
    unsubscribe(tid);
  }

  filterItems = (items, keyword) => filter(
    items,
    ({ id }) => includes(
      id.toLowerCase(),
      keyword.toLowerCase(),
    ),
  )

  filterItemswithSubscriptionIcon = (items, keyword) => filter(
    items,
    ({ topic_id: tid }) => includes(
      tid.toLowerCase(),
      keyword.toLowerCase(),
    ),
  )

  renderNDI = (item) => {
    const { id, icon } = item;
    return (
      <div
        key={id}
        className="appHeader__navigatorDropdownItem"
        onClick={this.switchNavigatorDropdown}
        role="presentation"
      >
        <Link to={`/${id}`}>
          <div className="appHeader__navigatorDropdownItem__leftIcon">
            <Icon type={icon} style={iconStyles.blue} />
          </div>
          <div className="appHeader__navigatorDropdownItem__content">
            {id}
          </div>
        </Link>
      </div>
    );
  }

  renderNDIwithSubscriptionIcon = (item) => {
    const {
      topic_id: tid, icon,
    } = item;
    return (
      <div
        key={tid}
        className="appHeader__navigatorDropdownItem"
        onClick={this.switchNavigatorDropdown}
        role="presentation"
      >
        <Link to={`/c/${tid}`}>
          <div className="appHeader__navigatorDropdownItem__leftIcon">
            <Icon type={icon} style={iconStyles.blue} />
          </div>
          <div className="appHeader__navigatorDropdownItem__content">
            {tid}
          </div>
        </Link>
        <div
          className="appHeader__navigatorDropdownItem__rightIcon"
          onClick={e => this.unsubscribe(e, tid)}
          role="presentation"
        >
          <Icon type="star" theme="filled" style={iconStyles.yellow} />
        </div>
      </div>
    );
  }

  renderNavigatorDropdown = () => {
    const { subscriptions, intl } = this.props;
    const { navigatorFilterKeyword } = this.state;

    return (
      <div className="appHeader__navigatorDropdown">
        <div className="appHeader__navigatorDropdown__filter">
          <Input
            type="text"
            placeholder={intl.formatMessage({ id: 'appHeader_navigator_filter' })}
            value={navigatorFilterKeyword}
            onChange={this.onNavigatorFilterChange}
          />
        </div>
        <div className="appHeader__navigatorDropdown__group">
          <div className="appHeader__navigatorDropdown__groupTitle">
            {intl.formatMessage({ id: 'appHeader_navigator_feeds' })}
          </div>
          {map(
            this.filterItems(feeds, navigatorFilterKeyword),
            item => this.renderNDI(item),
          )}
        </div>
        <div className="appHeader__navigatorDropdown__group">
          <div className="appHeader__navigatorDropdown__groupTitle">
            {intl.formatMessage({ id: 'appHeader_navigator_subscriptions' })}
          </div>
          {map(
            this.filterItemswithSubscriptionIcon(subscriptions, navigatorFilterKeyword),
            item => this.renderNDIwithSubscriptionIcon(item),
          )}
        </div>
      </div>
    );
  }

  renderNavigatorBar = () => {
    const { navigatorBarContent: { icon, title } } = this.props;
    const { showNavigatorDropdown } = this.state;

    return (
      <div
        className="appHeader__navigatorBar"
        onClick={this.switchNavigatorDropdown}
        role="presentation"
      >
        <div className="appHeader__navigatorBar__leftIcon">
          <Icon type={icon} style={iconStyles.blue} />
        </div>
        <div className="appHeader__navigatorBar__content">
          {title}
        </div>
        <div className="appHeader__navigatorBar__rightIcon">
          <Icon type={showNavigatorDropdown ? 'caret-up' : 'caret-down'} />
        </div>
      </div>
    );
  }

  renderNavigator = () => {
    const { showNavigatorDropdown } = this.state;
    const classNames = classnames({
      appHeader__navigator: true,
      hide: !showNavigatorDropdown,
      show: showNavigatorDropdown,
    });

    return (
      <div className={classNames} ref={this.navigator}>
        {this.renderNavigatorBar()}
        {showNavigatorDropdown && this.renderNavigatorDropdown()}
      </div>
    );
  }

  hideSearchHistory = (e) => {
    const { showSearchHistory } = this.state;
    if (showSearchHistory) {
      // 当前点击区域不在search中
      if (!this.search.current.contains(e.target)) {
        this.setState({
          showSearchHistory: false,
        });
      }
    }
  }

  onSearchFocus = () => {
    this.setState({
      showSearchHistory: true,
    });
  }

  onSearchChange = (e) => {
    this.setState({
      searchKeyword: e.target.value,
    });
  }

  go2SearchPanel = (searchKeyword) => {
    const { history } = this.props;
    history.push(`/search?q=${encodeURIComponent(searchKeyword)}`);
  }

  onSearchEnter = (e) => {
    e.persist();
    const currentSearchKeyword = e.target.value;
    if (currentSearchKeyword) {
      this.setState((prevState) => {
        const newSearchHistory = [
          currentSearchKeyword,
          ...prevState.searchHistory,
        ];

        // 本地存储新的搜索历史
        SearchHistory.storeSearchHistory(newSearchHistory);

        // 更改搜索栏状态
        return {
          searchHistory: newSearchHistory,
          showSearchHistory: false,
        };
      }, () => this.go2SearchPanel(currentSearchKeyword)); // 跳转到搜索页
    }
  }

  onSearchHistoryClick = (historySearchKeyword) => {
    this.setState({
      searchKeyword: historySearchKeyword,
      showSearchHistory: false,
    }, () => this.go2SearchPanel(historySearchKeyword)); // 跳转到搜索页
  }

  clearSearchHistory = (e, index) => {
    e.stopPropagation();
    this.setState((prevState) => {
      const newSearchHistory = filter(
        prevState.searchHistory,
        (item, i) => i !== index,
      );

      // 本地存储新的历史记录
      SearchHistory.storeSearchHistory(newSearchHistory);

      const result = {
        searchHistory: newSearchHistory,
      };
      if (prevState.searchHistory.length === 1) {
        return { ...result, showSearchHistory: false };
      }
      return result;
    });
  }

  renderSearchHistory = () => {
    const { searchHistory } = this.state;
    return (
      <div className="appHeader__searchHistory">
        {map(searchHistory, (historySearchKeyword, index) => (
          <div
            key={index}
            className="appHeader__searchHistory__item"
            onClick={() => this.onSearchHistoryClick(historySearchKeyword)}
            role="presentation"
          >
            <div className="appHeader__searchHistory__keyword">{historySearchKeyword}</div>
            <div
              className="appHeader__searchHistory__clear"
              onClick={e => this.clearSearchHistory(e, index)}
              role="presentation"
            >
              <Icon type="close-circle" theme="filled" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  renderSearch = () => {
    const { intl } = this.props;
    const { searchKeyword, showSearchHistory } = this.state;
    return (
      <div className="appHeader__search__container" ref={this.search}>
        <Input
          type="text"
          className="appHeader__search"
          prefix={<Icon type="search" />}
          placeholder={intl.formatMessage({ id: 'appHeader_search_news' })}
          value={searchKeyword}
          onFocus={this.onSearchFocus}
          onChange={this.onSearchChange}
          onPressEnter={this.onSearchEnter}
          allowClear
        />
        {showSearchHistory && this.renderSearchHistory()}
      </div>
    );
  }

  renderNoticeMenu = () => {
    const { notices, deleteNotice, intl } = this.props;
    return isEmpty(notices) ? (
      <div className="appHeader__notice__empty">
        {intl.formatMessage({ id: 'appHeader_readall_notice' })}
      </div>
    ) : map(notices, notice => (
      <div
        key={notice.id}
        className="appHeader__notice__item"
        onClick={() => deleteNotice(notice.id)}
        role="presentation"
      >
        <div className="appHeader__notice__title">{notice.title}</div>
        <div className="appHeader__notice__message">{notice.message}</div>
      </div>
    ));
  }

  renderNotice = () => (
    <div className="appHeader__notice__container">
      <div className="appHeader__notice">
        <Popover
          placement="bottomRight"
          arrowPointAtCenter
          trigger="click"
          content={this.renderNoticeMenu()}
        >
          <Icon className="appHeader__notice__icon" type="bell" />
        </Popover>
      </div>
    </div>
  );

  render() {
    return (
      <div className="appHeader">
        {this.renderNavigator()}
        {this.renderSearch()}
        {this.renderNotice()}
      </div>
    );
  }
}

AppHeader.propTypes = {
  notices: PropTypes.array.isRequired,
  subscriptions: PropTypes.array.isRequired,
  navigatorBarContent: PropTypes.object.isRequired,
  searchQuery: PropTypes.string.isRequired,
  deleteNotice: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default AppHeader;
