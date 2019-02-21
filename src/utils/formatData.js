import isArray from 'lodash/isArray';
import reduce from 'lodash/reduce';

/**
 * 格式化数据
 * @param {Array|Object} data 原始数据，可以是对象数组也可以是单个对象
 * @param {Object} schema 领域实体的schema
 */
const formatData = (data, schema) => {
  const { id, name } = schema;
  if (isArray(data)) {
    return reduce(
      data,
      (result, item) => {
        // eslint-disable-next-line no-param-reassign
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
    [name]: {
      [data[id]]: data,
    },
    ids: [data[id]],
  };
};

export default formatData;
