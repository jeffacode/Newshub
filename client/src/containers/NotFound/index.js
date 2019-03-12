import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'components/IntlContext';
import { connect } from 'react-redux';
import {
  setNavigatorBar,
} from 'redux/modules/app/action';
import { Button } from 'antd';
import './style.scss';

class NotFound extends Component {
  componentDidMount() {
    const { setNavigatorBar, intl } = this.props;
    setNavigatorBar('frown', intl.formatMessage({ id: 'oops' }));
  }

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
  setNavigatorBar: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  setNavigatorBar,
};

export default injectIntl(connect(
  null,
  mapDispatchToProps,
)(NotFound));
