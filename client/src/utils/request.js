import axios from 'axios';
import appConfig from 'app/config/appConfig';
import Auth from 'utils/Auth';
import Locale from 'utils/Locale';
import {
  FETCH,
  POST,
  PATCH,
  DELETE,
} from './createAsyncAction';

const { apiDomain } = appConfig;

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  cache: false,
};

const instance = axios.create({
  baseURL: apiDomain,
  timeout: 5000,
  headers: defaultHeaders,
});

instance.interceptors.request.use((config) => {
  if (Auth.isUserAuthenticated()) {
    config.headers['x-access-token'] = Auth.getToken();
  }
  if (Locale.localeExisted()) {
    config.headers.language = Locale.getLocale();
  }
  return config;
});

const handleResponse = ({ data }) => data;

const handleError = (asyncType, url, error) => {
  const { response, request } = error;

  if (response) {
    // 前端成功发送请求，后端返回了2xx之外的响应
    const { status } = response;
    console.error(`Server responded with status code ${status}. Url = ${url}.`);
  } else if (request) {
    // 前端成功发送请求，但后端没有返回响应
    console.error(`No response was received. Url = ${url}.`);
  } else {
    // 前端发送请求失败
    console.error(`Something happened in setting up the request. Url = ${url}`);
  }

  const { data } = response;
  if (data && data.message) {
    return Promise.reject(data);
  }
  return Promise.reject({
    message: asyncType, // 如果后端没有返回错误信息，前端显示默认的错误信息
  });
};

export default {
  get: (url, params) => (
    instance.get(url, {
      params,
    })
      .then(handleResponse)
      .catch(error => handleError(FETCH, url, error))
  ),
  post: (url, data) => (
    instance.post(url, data)
      .then(handleResponse)
      .catch(error => handleError(POST, url, error))
  ),
  patch: (url, data) => (
    instance.patch(url, data)
      .then(handleResponse)
      .catch(error => handleError(PATCH, url, error))
  ),
  delete: url => (
    instance.delete(url)
      .then(handleResponse)
      .catch(error => handleError(DELETE, url, error))
  ),
};
