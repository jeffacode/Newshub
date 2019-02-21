import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import {
  Avatar,
  Dropdown,
  Menu,
  Icon,
  Popover,
} from 'antd';
import getFirstChar from 'utils/getFirstChar';
import './style.scss';

const AppHeader = ({
  user,
  notices,
  logout,
  deleteNotice,
  intl,
}) => {
  const noticeMenu = isEmpty(notices) ? (
    <div className="appHeader__noticeEmpty">
      {intl.formatMessage({ id: 'appHeader_readall_notice' })}
    </div>
  ) : map(notices, notice => (
    <div
      key={notice.id}
      className="appHeader__noticeItem"
      onClick={() => deleteNotice(notice.id)}
      role="presentation"
    >
      <div className="appHeader__noticeTitle">{notice.title}</div>
      <div className="appHeader__noticeMessage">{notice.message}</div>
    </div>
  ));

  const userMenu = (
    <Menu>
      <Menu.Item disabled className="appHeader__userMenuItem">
        <Icon type="user" className="appHeader__userMenuIcon" />
        <span>{intl.formatMessage({ id: 'appHeader_profile' })}</span>
      </Menu.Item>
      <Menu.Item disabled className="appHeader__userMenuItem">
        <Icon type="setting" className="appHeader__userMenuIcon" />
        <span>{intl.formatMessage({ id: 'appHeader_setting' })}</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item className="appHeader__userMenuItem">
        <div
          onClick={logout}
          role="presentation"
        >
          <Icon type="logout" className="appHeader__userMenuIcon" />
          <span>{intl.formatMessage({ id: 'appHeader_logout' })}</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="appHeader">
      <div className="appHeader__notice">
        <Popover
          placement="bottomRight"
          arrowPointAtCenter
          trigger="click"
          content={noticeMenu}
        >
          <Icon className="appHeader__noticeIcon" type="bell" />
        </Popover>
      </div>
      <Dropdown overlay={userMenu} placement="bottomRight">
        <div className="appHeader__avatarContainer">
          <Avatar className="appHeader__avatar">
            {getFirstChar(user.name)}
          </Avatar>
        </div>
      </Dropdown>
    </div>
  );
};

AppHeader.propTypes = {
  user: PropTypes.object.isRequired,
  notices: PropTypes.array.isRequired,
  logout: PropTypes.func.isRequired,
  deleteNotice: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default AppHeader;
