import Cookie from 'js-cookie';

const { localStorage } = window;

class Locale {
  static storeLocale(locale) {
    if (localStorage) {
      localStorage.setItem('locale', locale);
    } else {
      Cookie.set('locale', locale);
    }
  }

  static localeExisted() {
    if (localStorage) {
      return localStorage.getItem('locale') !== null;
    }
    return Cookie.get('locale') !== null;
  }

  static getLocale() {
    if (localStorage) {
      return localStorage.getItem('locale');
    }
    return Cookie.get('locale');
  }
}

export default Locale;
