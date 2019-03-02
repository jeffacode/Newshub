import React from 'react';
import IntlContext from './IntlContext';

const injectIntl = (WrappedComponent) => {
  const InjectIntl = props => (
    <IntlContext.Consumer>
      {value => <WrappedComponent {...props} intl={value} />}
    </IntlContext.Consumer>
  );

  return InjectIntl;
};

export default injectIntl;
