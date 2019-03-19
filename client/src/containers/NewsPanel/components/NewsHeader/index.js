import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import popularities from 'constant/popularities';
import times from 'constant/times';
import views from 'constant/views';
import iconStyles from 'constant/iconStyles';
import formatNumber from 'utils/formatNumber';
import {
  Icon, Tooltip, Menu, Dropdown,
} from 'antd';
import './style.scss';

class NewsHeader extends Component {
  renderHeaderGroup = (title, ...items) => {
    const { intl } = this.props;
    return (
      <div className="newsHeader__headerGroup">
        <div className="newsHeader__headerGroup__title ft-bold">
          {intl.formatMessage({ id: `headerGroup_${title}` })}
        </div>
        {map(items, (item, index) => (
          <div
            key={index}
            className="newsHeader__headerGroup__item"
          >
            {item}
          </div>
        ))}
      </div>
    );
  }

  renderViewSwitch = () => {
    const { selectedView, selectView } = this.props;
    const { intl } = this.props;
    const viewSwitch = (
      map(views, (view) => {
        const { id, name, icon } = view;
        return (
          <div
            key={id}
            className="newsHeader__viewSwitch"
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

  renderSortSelector = (options, selectedOption, handler) => {
    const { intl } = this.props;
    const menu = (
      <Menu>
        {map(options, (option) => {
          const { id, name, icon } = option;
          return (
            <Menu.Item key={id}>
              <div
                className="newsHeader__sortSelector__option"
                onClick={() => handler(option)}
                role="presentation"
              >
                {icon && (
                  <div>
                    <span className="mr-5">
                      <Icon type={icon} style={iconStyles.blue} />
                    </span>
                  </div>
                )}
                <div>{intl.formatMessage({ id: name })}</div>
              </div>
            </Menu.Item>
          );
        })}
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <div className="newsHeader__sortSelector__option--selected ft-bold">
          {selectedOption.icon && (
            <div>
              <span className="mr-5">
                <Icon type={selectedOption.icon} />
              </span>
            </div>
          )}
          <div>
            {intl.formatMessage({ id: selectedOption.name })}
          </div>
          <div>
            <Icon type="caret-down" />
          </div>
        </div>
      </Dropdown>
    );
  }

  renderSort = () => {
    const {
      selectedTime,
      selectedPopularity,
      selectTime,
      selectPopularity,
    } = this.props;
    return this.renderHeaderGroup(
      'sort',
      this.renderSortSelector(
        times,
        selectedTime,
        selectTime,
      ),
      this.renderSortSelector(
        popularities,
        selectedPopularity,
        selectPopularity,
      ),
    );
  }

  render() {
    const { topicIdFromRoute, topic: { icon, subscribers }, intl } = this.props;
    return (
      <div className="newsHeader">
        {
          topicIdFromRoute && (
            <div className="newsHeader__content">
              <Icon type={icon || 'robot'} className="newsHeader__icon" />
              <div className="newsHeader__title">{topicIdFromRoute}</div>
              <div className="newsHeader__subscribers">
                {`${formatNumber(subscribers)} `}
                {intl.formatMessage({ id: 'subscribers_count' })}
              </div>
            </div>
          )
        }
        <div className="newsHeader__menu">
          {this.renderSort()}
          {this.renderViewSwitch()}
        </div>
      </div>
    );
  }
}

NewsHeader.propTypes = {
  topicIdFromRoute: PropTypes.string,
  topic: PropTypes.object.isRequired,
  selectedView: PropTypes.object.isRequired,
  selectedTime: PropTypes.object.isRequired,
  selectedPopularity: PropTypes.object.isRequired,
  selectView: PropTypes.func.isRequired,
  selectPopularity: PropTypes.func.isRequired,
  selectTime: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

NewsHeader.defaultProps = {
  topicIdFromRoute: '',
};

export default NewsHeader;
