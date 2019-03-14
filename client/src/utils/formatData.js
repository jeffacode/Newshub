import isArray from 'lodash/isArray';
import reduce from 'lodash/reduce';

/**
 * 格式化数据
 * @param {Array} response 原始数据
 * @param {Object} schema 领域实体的schema
 */
const formatData = (response, schema) => {
  const { id, name } = schema;
  const { metadata } = response;
  let { data } = response;

  if (!metadata) {
    // metadata数据不存在，response直接赋值给data
    data = response;
  }

  let formattedData;

  if (isArray(data)) {
    formattedData = reduce(
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
  } else {
    formattedData = {
      [name]: data,
    };
  }

  if (metadata) {
    return {
      ...formattedData,
      metadata,
    };
  }
  return formattedData;
};

export default formatData;
