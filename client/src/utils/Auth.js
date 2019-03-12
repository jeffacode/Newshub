import Cookie from 'js-cookie';

const { localStorage } = window;

class Auth {
  static authenticateUser(token, user) {
    if (localStorage) {
      localStorage.setItem('token', token); // 保存token用于鉴权
      localStorage.setItem('user', JSON.stringify(user)); // 同时保存用户信息
    } else {
      Cookie.set('token', token);
      Cookie.set('user', JSON.stringify(user));
    }
  }

  static isUserAuthenticated() {
    if (localStorage) {
      return localStorage.getItem('token') !== null;
    }
    return Cookie.get('token') !== null;
  }

  static deauthenticateUser() {
    if (localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    Cookie.remove('token');
    Cookie.remove('user');
  }

  static getToken() {
    if (localStorage) {
      return localStorage.getItem('token');
    }
    return Cookie.get('token');
  }

  static getUser() {
    if (localStorage) {
      return JSON.parse(localStorage.getItem('user'));
    }
    return JSON.parse(Cookie.get('user'));
  }
}

export default Auth;
