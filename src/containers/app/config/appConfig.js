import localeMap from 'i18n/locale.json';

const appConfig = {
  defaultLocale: 'zh-cn', // 默认locale
  localeMap,
  apiDomain: process.env.NODE_ENV === 'development' ? 'http://localhost:3004' : '',
};

export default appConfig;
