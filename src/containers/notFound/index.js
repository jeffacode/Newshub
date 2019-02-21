import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'components/IntlContext';
import { Button } from 'antd';
import './style.scss';

class NotFound extends Component {
  render() {
    const { intl } = this.props;

    return (
      <div className="notFound">
        <div className="notFound__errorCode">
          404
        </div>
        <div className="notFound__errorDesc">
          {intl.formatMessage({ id: 'notFound_404' })}
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

NotFound.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(NotFound);
