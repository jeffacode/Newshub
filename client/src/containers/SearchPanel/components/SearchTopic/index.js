import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import formatNumber from 'utils/formatNumber';
import { Icon, Button } from 'antd';
import './style.scss';

const SearchTopic = ({ categories, onSubscribeBtnClick, intl }) => (
  <div className="searchTopic">
    <div className="searchTopic__title">
      {intl.formatMessage({ id: 'searchTopic_title' })}
    </div>
    <div className="searchTopic__content">
      {map(categories, ({
        topic_id: tid, icon, subscribers, subscribed,
      }) => (
        <div className="searchTopic__topic" key={tid}>
          <div className="searchTopic__topic__icon">
            <Icon type={icon} />
          </div>
          <div className="searchTopic__topic__title">
            <div className="searchTopic__topic__name">{`c/${tid}`}</div>
            <div className="searchTopic__topic__subscribers">
              {`${formatNumber(subscribers)} `}
              {intl.formatMessage({ id: 'subscribers_count' })}
            </div>
          </div>
          <div className="searchTopic__topic__subscribeBtn">
            <Button
              type={subscribed ? 'primary' : 'default'}
              onClick={() => onSubscribeBtnClick(tid, subscribed)}
            >
              {intl.formatMessage({ id: subscribed ? 'subscribed' : 'subscribe' })}
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

SearchTopic.propTypes = {
  categories: PropTypes.array.isRequired,
  onSubscribeBtnClick: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default SearchTopic;
