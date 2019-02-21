import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { injectIntl } from 'components/IntlContext';
import './style.scss';

const Loading = ({ intl }) => (
  <div className="loading">
    <Icon type="loading" />
    <span className="loading__text ml-5">{intl.formatMessage({ id: 'loading' })}</span>
  </div>
);

Loading.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Loading);
