import isArray from 'lodash/isArray';
import reduce from 'lodash/reduce';

/**
 * 格式化数据
 * @param {Array} data 原始数据
 * @param {Object} schema 领域实体的schema
 */
const formatData = (data, schema) => {
  const { id, name } = schema;
  if (isArray(data)) {
    return reduce(
      data,
      (result, item) => {
        result[name][item[id]] = item;
        result.ids.push(item[id]);
        return result;
      },
      {
        [name]: {},
        ids: [],
      },
    );
  }
  return {
    [name]: data,
  };
};

export default formatData;
