export const ASYNC_ACTION = 'ASYNC';
export const FETCH_DATA = 'FETCH_DATA';
export const POST_DATA = 'POST_DATA';
export const CHANGE_DATA = 'CHANGE_DATA';
export const DELETE_DATA = 'DELETE_DATA';

/**
 * 返回创建异步action的函数
 * @param {String} asyncType FETCH_DATA|POST_DATA|CHANGE_DATA|DELETE_DATA
 * @param {Object} types {requestType, successType, failureType}
 * @param {Object} schema entity schema, required when fetching data
 * @param {Object} config 配置项
 */
export const getAysncActionCreator = (
  asyncType,
  types,
  schema,
  config = {},
) => (url, data) => {
  if (schema) {
    const { withoutResponse, withoutErrorResponse } = schema;
    // 如果传入的schema实际是config，互换两者
    if (withoutResponse || withoutErrorResponse) {
      config = schema;
      schema = null;
    }
  }
  return {
    [ASYNC_ACTION]: {
      asyncType,
      types,
      schema,
      url,
      data,
      config,
    },
  };
};
