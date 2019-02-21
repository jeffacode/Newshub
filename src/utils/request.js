import axios from 'axios';
import appConfig from 'containers/app/config/appConfig';
import {
  FETCH_DATA,
  POST_DATA,
  CHANGE_DATA,
  DELETE_DATA,
} from './createAsyncAction';

const asyncTypeToMsg = {
  FETCH_DATA: 'fetchData_failed', // 获取数据失败
  POST_DATA: 'postData_failed', // 发送数据失败
  CHANGE_DATA: 'changeData_failed', // 更改数据失败
  DELETE_DATA: 'deleteData_failed', // 删除数据失败
};

const { apiDomain } = appConfig;

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const instance = axios.create({
  baseURL: apiDomain,
  timeout: 5000,
  headers: defaultHeaders,
  withCredentials: true,
});

const handleResponse = response => response.data;

const handleError = (asyncType, url, error) => {
  if (error.response) { // 前端成功发送请求，后端返回了2xx之外的响应
    const { status } = error.response;
    console.error(`Server responded. Url = ${url}. Status = ${status}.`);
  } else if (error.request) { // 前端成功发送请求，但后端没有返回响应
    console.error(`No response was received. Url = ${url}.`);
  } else { // 前端发送请求失败
    console.error(`Something happened in setting up the request. Url = ${url}. Message = ${error.message}.`);
  }
  // 无论是哪种错误情况，前端只需提示失败即可，不要暴露过多细节，调试器里能看到更具体的错误信息
  return Promise.reject(new Error(asyncTypeToMsg[asyncType]));
};

export default {
  get: url => (
    instance.get(url)
      .then(handleResponse)
      .catch(error => handleError(FETCH_DATA, url, error))
  ),
  post: (url, data) => (
    instance.post(url, data)
      .then(handleResponse)
      .catch(error => handleError(POST_DATA, error))
  ),
  patch: (url, data) => (
    instance.patch(url, data)
      .then(handleResponse)
      .catch(error => handleError(CHANGE_DATA, error))
  ),
  delete: url => (
    instance.delete(url)
      .then(handleResponse)
      .catch(error => handleError(DELETE_DATA, error))
  ),
};
