import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import memoize from 'memoize-one';
import { Link } from 'react-router-dom';
import map from 'lodash/map';
import {
  getUserProfileMenu,
  getUserSettingsMenu,
} from 'app/config/menu';
import {
  getFullPathMenu,
  getMenuKeys,
  urlToPaths,
  getSelectedKeys,
} from 'utils/menuUtils';
import getFirstChar from 'utils/getFirstChar';
import logo from 'assets/logo.png';
import { Menu, Icon, Avatar } from 'antd';
import './style.scss';

const { SubMenu } = Menu;
const memoizeFullPathMenu = memoize(menu => getFullPathMenu(menu));
const memoizeSelectedKeys = memoize((url, fullPathMenu) => getSelectedKeys(
  urlToPaths(url),
  getMenuKeys(fullPathMenu),
));

class AppSider extends Component {
  constructor(props) {
    super(props);
    const { user: { username }, url } = props;
    const userProfileMenu = this.formatMenuData(getUserProfileMenu(username));
    const userSettingsMenu = this.formatMenuData(getUserSettingsMenu());
    this.state = {
      userProfileOpenKeys: memoizeSelectedKeys(url, memoizeFullPathMenu(userProfileMenu)),
      userSettingsOpenKeys: memoizeSelectedKeys(url, memoizeFullPathMenu(userSettingsMenu)),
    };
  }

  formatMenuData = (menu) => {
    const { intl } = this.props;

    return map(menu, (item) => {
      const result = {
        ...item,
        name: intl.formatMessage({ id: item.name }),
      };

      if (item.children) {
        result.children = this.formatMenuData(item.children);
      }

      return result;
    });
  };

  renderMenu = data => (
    map(data, (item) => {
      if (item.children) {
        return (
          <SubMenu
            key={item.path}
            title={(
              <span>
                {item.icon && <Icon type={item.icon} />}
                <span>{item.name}</span>
              </span>
            )}
          >
            {this.renderMenu(item.children)}
          </SubMenu>
        );
      }

      return (
        <Menu.Item key={item.path}>
          <Link to={item.path} href={item.path}>
            {item.icon && <Icon type={item.icon} />}
            <span>{item.name}</span>
          </Link>
        </Menu.Item>
      );
    })
  )

  logout = () => {
    const { logout, history } = this.props;
    logout();
    history.push('/');
  }

  renderSiderHeader = () => {
    const {
      isLogin,
      user,
      intl,
    } = this.props;
    const { username } = user;
    const classNames = classnames({
      appSider__header: true,
      notLogin: !isLogin,
    });

    return isLogin ? (
      <div className={classNames}>
        <div className="appSider__header__btns">
          <div className="appSider__header__btn">
            <Avatar className="appSider__header__avatar">
              {getFirstChar(username)}
            </Avatar>
            <div className="appSider__header__name ml-5">
              <Link to="/">{username}</Link>
            </div>
          </div>
          <div
            className="appSider__header__btn"
            onClick={this.logout}
            role="presentation"
          >
            <Icon type="logout" />
            <span className="ml-5">{intl.formatMessage({ id: 'logout' })}</span>
          </div>
        </div>
      </div>
    ) : (
      <div className={classNames}>
        <div>
          <Link to="/">
            <img className="appSider__header__logo" src={logo} alt="logo" />
          </Link>
        </div>
        <div className="appSider__header__btns">
          <div className="appSider__header__btn">
            <Link to="/login">
              <Icon type="login" />
              <span className="ml-5">{intl.formatMessage({ id: 'login' })}</span>
            </Link>
          </div>
          <div className="appSider__header__btn">
            <Link to="/signup">
              <Icon type="idcard" />
              <span className="ml-5">{intl.formatMessage({ id: 'signup' })}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  handleOpenChange = (name, openKeys) => {
    this.setState({
      [name]: openKeys,
    });
  };

  renderUserProfile = () => {
    const { user: { username }, url, intl } = this.props;
    const { userProfileOpenKeys } = this.state;
    const userProfileMenu = this.formatMenuData(getUserProfileMenu(username));

    return (
      <div className="appSider__userProfile">
        <div className="appSider__mainTitle">
          <Icon type="user" />
          <span className="ml-5">{intl.formatMessage({ id: 'appSider_userProfile' })}</span>
        </div>
        <Menu
          mode="inline"
          openKeys={userProfileOpenKeys}
          selectedKeys={memoizeSelectedKeys(url, memoizeFullPathMenu(userProfileMenu))}
          onOpenChange={openKeys => this.handleOpenChange('userProfileOpenKeys', openKeys)}
        >
          {this.renderMenu(memoizeFullPathMenu(userProfileMenu))}
        </Menu>
      </div>
    );
  }

  renderUserSettings = () => {
    const { url, intl } = this.props;
    const { userSettingsOpenKeys } = this.state;
    const userSettingsMenu = this.formatMenuData(getUserSettingsMenu());

    return (
      <div className="appSider__userSettings">
        <div className="appSider__mainTitle">
          <Icon type="setting" />
          <span className="ml-5">{intl.formatMessage({ id: 'appSider_userSettings' })}</span>
        </div>
        <Menu
          mode="inline"
          openKeys={userSettingsOpenKeys}
          selectedKeys={memoizeSelectedKeys(url, memoizeFullPathMenu(userSettingsMenu))}
          onOpenChange={openKeys => this.handleOpenChange('userSettingsOpenKeys', openKeys)}
        >
          {this.renderMenu(memoizeFullPathMenu(userSettingsMenu))}
        </Menu>
      </div>
    );
  }

  render() {
    const { isLogin } = this.props;

    return (
      <div className="appSider">
        {this.renderSiderHeader()}
        {isLogin && (
          <div className="appSider__menuContent">
            {this.renderUserProfile()}
            {this.renderUserSettings()}
          </div>
        )}
      </div>
    );
  }
}

AppSider.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  url: PropTypes.string,
  history: PropTypes.object.isRequired,
};

AppSider.defaultProps = {
  url: '/',
};

export default AppSider;
