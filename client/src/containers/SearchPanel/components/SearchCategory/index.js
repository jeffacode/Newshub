import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import formatNumber from 'utils/formatNumber';
import { Icon, Button } from 'antd';
import './style.scss';

const SearchCategory = ({ categories, onSubscribeBtnClick, intl }) => (
  <div className="searchCategory">
    <div className="searchCategory__title">
      {intl.formatMessage({ id: 'searchCategory_title' })}
    </div>
    <div className="searchCategory__content">
      {map(categories, ({
        category_id: cid, icon, subscribers, subscribed,
      }) => (
        <div className="searchCategory__category" key={cid}>
          <div className="searchCategory__category__icon">
            <Icon type={icon} />
          </div>
          <div className="searchCategory__category__title">
            <div className="searchCategory__category__name">{`c/${cid}`}</div>
            <div className="searchCategory__category__subscribers">
              {`${formatNumber(subscribers)} `}
              {intl.formatMessage({ id: 'subscribers_count' })}
            </div>
          </div>
          <div className="searchCategory__category__subscribeBtn">
            <Button
              type={subscribed ? 'primary' : 'default'}
              onClick={() => onSubscribeBtnClick(cid, subscribed)}
            >
              {intl.formatMessage({ id: subscribed ? 'subscribed' : 'subscribe' })}
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

SearchCategory.propTypes = {
  categories: PropTypes.array.isRequired,
  onSubscribeBtnClick: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default SearchCategory;
