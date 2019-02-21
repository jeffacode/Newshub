import {
  ASYNC_ACTION,
  FETCH_DATA,
  POST_DATA,
  CHANGE_DATA,
  DELETE_DATA,
} from 'utils/createAsyncAction';
import request from 'utils/request';
import formatData from 'utils/formatData';

const asyncActionMiddleware = () => next => (action) => {
  const callAPI = action[ASYNC_ACTION];
  if (!callAPI) {
    return next(action);
  }

  const {
    asyncType,
    types,
    schema,
    url,
    data,
    config,
  } = callAPI;

  if (!asyncType) {
    throw new Error('AsyncType must be given.');
  }
  if (!types) {
    throw new Error('Types must be given.');
  }
  if (asyncType === FETCH_DATA) {
    if (!schema) {
      throw new Error('Entity schema must be given when fetching data.');
    } else {
      const { id, name } = schema;
      if (!id) {
        throw new Error('Entity schema must have an id.');
      }
      if (!name) {
        throw new Error('Entity schema must have a name.');
      }
    }
  }
  if (!url) {
    throw new Error('Url must be given.');
  }

  const { requestType, successType, failureType } = types;

  if (!requestType) {
    throw new Error('requestType must be given.');
  }
  if (!successType) {
    throw new Error('successType must be given.');
  }
  if (!failureType) {
    throw new Error('failureType must be given.');
  }

  // withoutResponse为true时，FETCH_DATA请求成功后并不会发送带有response字段的action
  // withoutErrorResponse为true时，请求失败后不会发送带有errorResponse字段的action
  const { withoutResponse, withoutErrorResponse } = config;

  const handleResponse = (response) => {
    if (asyncType === FETCH_DATA && !withoutResponse) {
      return next({
        type: successType,
        response: formatData(response, schema), // entity reducer会进一步处理带有此字段的action
      });
    }
    return next({
      type: successType,
      payload: response, // 否则只发带有payload字段的一般action
    });
  };

  const handleError = (error) => {
    if (!withoutErrorResponse) {
      return next({
        type: failureType,
        errorResponse: error.message, // app reducer会进一步处理带有此字段的action
      });
    }
    return Promise.reject(next({ // 否则返回一个rejected的Promise对象，以便进一步catch处理
      type: failureType,
    }));
  };

  next({
    type: requestType,
  });

  switch (asyncType) {
    case FETCH_DATA:
      return request.get(url)
        .then(handleResponse)
        .catch(handleError);
    case POST_DATA:
      return request.post(url, data)
        .then(handleResponse)
        .catch(handleError);
    case CHANGE_DATA:
      return request.patch(url, data)
        .then(handleResponse)
        .catch(handleError);
    case DELETE_DATA:
      return request.delete(url)
        .then(handleResponse)
        .catch(handleError);
    default:
      throw new Error(`AsyncType cannot match any of ${FETCH_DATA}/${POST_DATA}/${CHANGE_DATA}/${DELETE_DATA}.`);
  }
};

export default asyncActionMiddleware;
