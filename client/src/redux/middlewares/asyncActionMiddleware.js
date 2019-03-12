import {
  ASYNC_ACTION,
  FETCH,
  POST,
  PATCH,
  DELETE,
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
  } = callAPI;

  if (!asyncType) {
    throw new Error('AsyncType must be given.');
  }
  if (!types) {
    throw new Error('Types must be given.');
  }
  if (asyncType === FETCH) {
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

  const handleData = (data) => {
    if (asyncType === FETCH) {
      return next({
        type: successType,
        data: formatData(data, schema),
      });
    }
    return next({
      type: successType,
      payload: data,
    });
  };

  const handleError = error => Promise.reject(
    next({
      type: failureType,
      error,
    }),
  );

  next({
    type: requestType,
  });

  switch (asyncType) {
    case FETCH:
      return request.get(url, data)
        .then(handleData)
        .catch(handleError);
    case POST:
      return request.post(url, data)
        .then(handleData)
        .catch(handleError);
    case PATCH:
      return request.patch(url, data)
        .then(handleData)
        .catch(handleError);
    case DELETE:
      return request.delete(url)
        .then(handleData)
        .catch(handleError);
    default:
      throw new Error(`AsyncType cannot match any of ${FETCH}/${POST}/${PATCH}/${DELETE}.`);
  }
};

export default asyncActionMiddleware;
