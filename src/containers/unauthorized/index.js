import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'components/IntlContext';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import './style.scss';

class Unauthorized extends Component {
  render() {
    const { intl } = this.props;

    return (
      <div className="unauthorized">
        <div className="unauthorized__errorCode">
          403
        </div>
        <div className="unauthorized__errorDesc">
          {intl.formatMessage({ id: 'unauthorized_403' })}
        </div>
        <Link to="/" href="/">
          <Button type="primary">
            {intl.formatMessage({ id: 'exception_backToHome' })}
          </Button>
        </Link>
      </div>
    );
  }
}

Unauthorized.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Unauthorized);
