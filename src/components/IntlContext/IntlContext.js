import React from 'react';

const IntlContext = React.createContext({
  locale: '',
  localeMessages: {},
  formatMessage: () => {},
});

export default IntlContext;
