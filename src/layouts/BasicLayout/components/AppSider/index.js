import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { Link } from 'react-router-dom';
import map from 'lodash/map';
import { Menu, Icon } from 'antd';
import menuData from 'containers/app/config/menu';
import {
  getFullPathMenu,
  getMenuKeys,
  urlToPaths,
  getSelectedKeys,
} from 'utils/menuUtils';
import logo from 'assets/logo.svg';
import './style.scss';

const { SubMenu } = Menu;

class AppSider extends Component {
  constructor(props) {
    super(props);

    const { url } = props;
    this.menuData = this.formatMenuData(menuData);
    // 调用时menuData不变就不会重新计算
    this.fullPathMenuData = memoize(menuData => getFullPathMenu(menuData));
    // 调用时url和fullPathMenuData不变就不会重新计算
    this.selectedKeys = memoize((url, fullPathMenuData) => getSelectedKeys(
      urlToPaths(url),
      getMenuKeys(fullPathMenuData),
    ));

    this.state = {
      openKeys: this.selectedKeys(url, this.fullPathMenuData(this.menuData)),
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

  renderSiderHeader = () => {
    const { intl } = this.props;

    return (
      <Link to="/" href="/">
        <div className="appSider__header">
          <img
            className="appSider__logo"
            src={logo}
            alt="logo"
          />
          <div className="appSider__appName">
            {intl.formatMessage({ id: 'appName' })}
          </div>
        </div>
      </Link>
    );
  }

  handleOpenChange = (openKeys) => {
    this.setState({
      openKeys,
    });
  };

  renderSiderBody = () => {
    const { url } = this.props;
    const { openKeys } = this.state;

    return (
      <div className="appSider__body">
        <Menu
          style={{ padding: '16px 0', width: '100%' }}
          mode="inline"
          theme="dark"
          openKeys={openKeys}
          selectedKeys={this.selectedKeys(url, this.fullPathMenuData(this.menuData))}
          onOpenChange={this.handleOpenChange}
        >
          {this.renderMenu(this.fullPathMenuData(this.menuData))}
        </Menu>
      </div>
    );
  }

  render() {
    return (
      <div className="appSider">
        {this.renderSiderHeader()}
        {this.renderSiderBody()}
      </div>
    );
  }
}

AppSider.propTypes = {
  intl: PropTypes.object.isRequired,
  url: PropTypes.string,
};

AppSider.defaultProps = {
  url: '/',
};

export default AppSider;
