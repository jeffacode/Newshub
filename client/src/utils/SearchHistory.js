import Cookie from 'js-cookie';

const { localStorage } = window;

class SearchHistory {
  static storeSearchHistory(searchHistory) {
    if (localStorage) {
      localStorage.setItem('search_history', JSON.stringify(searchHistory));
    } else {
      Cookie.set('search_history', JSON.stringify(searchHistory));
    }
  }

  static clearSearchHistory() {
    if (localStorage) {
      localStorage.removeItem('search_history');
    }
    Cookie.remove('search_history');
  }

  static searchHistoryExisted() {
    if (localStorage) {
      return localStorage.getItem('search_history') !== null;
    }
    return Cookie.get('search_history') !== null;
  }

  static getSearchHistory() {
    if (localStorage) {
      return JSON.parse(localStorage.getItem('search_history'));
    }
    return JSON.parse(Cookie.get('search_history'));
  }
}

export default SearchHistory;
