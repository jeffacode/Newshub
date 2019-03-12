export const ASYNC_ACTION = 'ASYNC';
export const FETCH = 'FETCH';
export const POST = 'POST';
export const PATCH = 'PATCH';
export const DELETE = 'DELETE';

/**
 * 返回创建异步action的函数
 * @param {String} asyncType FETCH|POST|PATCH|DELETE
 * @param {Object} types {requestType, successType, failureType}
 * @param {Object} schema entity schema, required when fetching data
 */
export const getAysncActionCreator = (
  asyncType,
  types,
  schema,
) => (url, data) => ({
  [ASYNC_ACTION]: {
    asyncType,
    types,
    schema,
    url,
    data,
  },
});
