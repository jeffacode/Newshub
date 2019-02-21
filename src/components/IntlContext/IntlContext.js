import React from 'react';

const { Provider, Consumer } = React.createContext({
  locale: '',
  localeMessages: {},
  formatMessage: () => {},
});

export {
  Provider,
  Consumer,
};
