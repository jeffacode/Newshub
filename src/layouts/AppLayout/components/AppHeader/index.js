import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import map from 'lodash/map';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import iconStyles from 'constant/iconStyles';
import { views } from 'redux/modules/app/reducer';
import {
  Input, Icon, Popover, Tooltip, Menu, Dropdown,
} from 'antd';
import './style.scss';

const feeds = [
  {
    id: 1,
    name: 'home',
    icon: 'home',
  },
  {
    id: 2,
    name: 'popular',
    icon: 'rise',
  },
  {
    id: 3,
    name: 'all',
    icon: 'project',
  },
];

const getFeeds = (isLogin) => {
  if (isLogin) {
    return feeds;
  }
  return feeds.slice(1, 3);
};

const popularityOptions = [
  {
    key: 1,
    name: 'appHeader_sortSelector_popularityBest',
    icon: 'rocket',
  },
  {
    key: 2,
    name: 'appHeader_sortSelector_popularityHot',
    icon: 'fire',
  },
  {
    key: 3,
    name: 'appHeader_sortSelector_popularityNew',
    icon: 'coffee',
  },
  {
    key: 4,
    name: 'appHeader_sortSelector_popularityControversial',
    icon: 'thunderbolt',
  },
  {
    key: 5,
    name: 'appHeader_sortSelector_popularityTop',
    icon: 'trophy',
  },
  {
    key: 6,
    name: 'appHeader_sortSelector_popularityRising',
    icon: 'rise',
  },
];

const timeOptions = [
  {
    key: 1,
    name: 'appHeader_sortSelector_timePastHour',
  },
  {
    key: 2,
    name: 'appHeader_sortSelector_timePast24Hours',
  },
  {
    key: 3,
    name: 'appHeader_sortSelector_timePastWeek',
  },
  {
    key: 4,
    name: 'appHeader_sortSelector_timePastMonth',
  },
  {
    key: 5,
    name: 'appHeader_sortSelector_timePastYear',
  },
  {
    key: 6,
    name: 'appHeader_sortSelector_timeOfAllTime',
  },
];

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.navigator = React.createRef();
    this.state = {
      showNavigatorDropdown: false,
      navigatorFilterKeyword: '',
      searchKeyword: '',
      selectedPopularityOption: popularityOptions[0],
      selectedTimeOption: timeOptions[0],
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.hideNavigatorDropdown);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideNavigatorDropdown);
  }

  switchNavigatorDropdown = () => {
    this.setState(prevState => ({
      showNavigatorDropdown: !prevState.showNavigatorDropdown,
    }));
  }

  hideNavigatorDropdown = (e) => {
    // 当前点击区域不在navigator中
    if (!this.navigator.current.contains(e.target)) {
      this.setState({
        showNavigatorDropdown: false,
      });
    }
  }

  onNavigatorFilterChange = (e) => {
    this.setState({
      navigatorFilterKeyword: e.target.value,
    });
  }

  unsubscribe = (e, id) => {
    e.stopPropagation(); // 阻止事件冒泡
    const { unsubscribe } = this.props;
    unsubscribe(id);
  }

  filterItems = (items, keyword) => filter(
    items,
    ({ name }) => includes(
      name,
      keyword.toLowerCase(),
    ),
  )

  renderNDI = (item) => {
    const { id, name, icon } = item;
    return (
      <div
        key={id}
        className="appHeader__navigatorDropdownItem"
        onClick={this.switchNavigatorDropdown}
        role="presentation"
      >
        <Link to={`/c/${name}`}>
          <div className="appHeader__navigatorDropdownItem__leftIcon">
            <Icon type={icon} style={iconStyles.blue} />
          </div>
          <div className="appHeader__navigatorDropdownItem__content">
            {name}
          </div>
        </Link>
      </div>
    );
  }

  renderNDIwithSubscriptionIcon = (item) => {
    const {
      id, name, icon,
    } = item;
    return (
      <div
        key={id}
        className="appHeader__navigatorDropdownItem"
        onClick={this.switchNavigatorDropdown}
        role="presentation"
      >
        <Link to={`/c/${name}`}>
          <div className="appHeader__navigatorDropdownItem__leftIcon">
            <Icon type={icon} style={iconStyles.blue} />
          </div>
          <div className="appHeader__navigatorDropdownItem__content">
            {name}
          </div>
        </Link>
        <div
          className="appHeader__navigatorDropdownItem__rightIcon"
          onClick={e => this.unsubscribe(e, id)}
          role="presentation"
        >
          <Icon type="star" theme="filled" style={iconStyles.yellow} />
        </div>
      </div>
    );
  }

  renderNavigatorDropdown = () => {
    const {
      isLogin, subscriptions, intl,
    } = this.props;
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
            this.filterItems(getFeeds(isLogin), navigatorFilterKeyword),
            item => this.renderNDI(item),
          )}
        </div>
        {isLogin && (
          <div className="appHeader__navigatorDropdown__group">
            <div className="appHeader__navigatorDropdown__groupTitle">
              {intl.formatMessage({ id: 'appHeader_navigator_subscriptions' })}
            </div>
            {map(
              this.filterItems(subscriptions, navigatorFilterKeyword),
              item => this.renderNDIwithSubscriptionIcon(item),
            )}
          </div>
        )}
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

  onSearchChange = (e) => {
    this.setState({
      searchKeyword: e.target.value,
    });
  }

  onSearchEnter = (e) => {
    console.log(e.target.value);
  }

  renderSearch = () => {
    const { intl } = this.props;
    const { searchKeyword } = this.state;
    return (
      <div className="appHeader__search__container">
        <Input
          type="text"
          className="appHeader__search"
          prefix={<Icon type="search" />}
          placeholder={intl.formatMessage({ id: 'appHeader_search_news' })}
          value={searchKeyword}
          onChange={this.onSearchChange}
          onPressEnter={this.onSearchEnter}
          allowClear
        />
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

  renderHeaderGroup = (title, ...items) => {
    const { intl } = this.props;

    return (
      <div className="appHeader__headerGroup">
        <div className="appHeader__headerGroup__title ft-bold">
          {intl.formatMessage({ id: `appHeader_headerGroup_${title}` })}
        </div>
        {map(items, (item, index) => (
          <div className="appHeader__headerGroup__item" key={index}>{item}</div>
        ))}
      </div>
    );
  }

  renderViewSwitch = () => {
    const { selectedView, selectView, intl } = this.props;
    const viewSwitch = (
      map(views, (view) => {
        const { id, name, icon } = view;
        return (
          <div
            key={id}
            className="appHeader__viewSwitch"
            onClick={() => selectView(view)}
            role="presentation"
          >
            <Tooltip
              placement="top"
              title={intl.formatMessage({ id: name })}
              trigger="hover"
            >
              <Icon
                type={icon}
                style={selectedView.id === id ? iconStyles.blue : iconStyles.grey}
              />
            </Tooltip>
          </div>
        );
      })
    );
    return this.renderHeaderGroup('view', viewSwitch);
  }

  selectPopularityOption = (option) => {
    this.setState({
      selectedPopularityOption: option,
    });
  }

  selectTimeOption = (option) => {
    this.setState({
      selectedTimeOption: option,
    });
  }

  renderSortSelector = (options, selectedOption, handler) => {
    const { intl } = this.props;
    const menu = (
      <Menu>
        {map(options, (option) => {
          const { key, name, icon } = option;
          return (
            <Menu.Item key={key}>
              <div
                className="appHeader__sortSelector__option"
                onClick={() => handler(option)}
                role="presentation"
              >
                {icon && (<div><span className="mr-5"><Icon type={icon} style={iconStyles.blue} /></span></div>)}
                <div>{intl.formatMessage({ id: name })}</div>
              </div>
            </Menu.Item>
          );
        })}
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <div className="appHeader__sortSelector__option--selected ft-bold">
          {selectedOption.icon && (<div><span className="mr-5"><Icon type={selectedOption.icon} /></span></div>)}
          <div>{intl.formatMessage({ id: selectedOption.name })}</div>
          <div><Icon type="caret-down" /></div>
        </div>
      </Dropdown>
    );
  }

  renderSort = () => {
    const { selectedPopularityOption, selectedTimeOption } = this.state;
    return this.renderHeaderGroup(
      'sort',
      this.renderSortSelector(
        popularityOptions,
        selectedPopularityOption,
        this.selectPopularityOption,
      ),
      this.renderSortSelector(
        timeOptions,
        selectedTimeOption,
        this.selectTimeOption,
      ),
    );
  }

  render() {
    const { isLogin } = this.props;

    return (
      <div className="appHeader">
        {this.renderNavigator()}
        {this.renderSort()}
        {this.renderViewSwitch()}
        {this.renderSearch()}
        {isLogin && this.renderNotice()}
      </div>
    );
  }
}

AppHeader.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  notices: PropTypes.array.isRequired,
  subscriptions: PropTypes.array.isRequired,
  selectedView: PropTypes.object.isRequired,
  navigatorBarContent: PropTypes.object.isRequired,
  deleteNotice: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  selectView: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default AppHeader;
