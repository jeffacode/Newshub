import isString from 'lodash/isString';

/**
 * 返回异步action types对象
 * @param {String} moduleName 模块名
 * @param {String} asyncName 异步action名
 */
const createAsyncActionTypes = (moduleName, asyncName) => {
  if (!isString(moduleName)) {
    throw new Error('Module name must be a string.');
  }
  if (!isString(asyncName)) {
    throw new Error('AsyncName name must be a string.');
  }
  return {
    requestType: `${moduleName}/${asyncName}_REQUEST`,
    successType: `${moduleName}/${asyncName}_SUCCESS`,
    failureType: `${moduleName}/${asyncName}_FAILURE`,
  };
};

export default createAsyncActionTypes;
