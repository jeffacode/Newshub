import isEmpty from 'lodash/isEmpty'; // 只有可枚举类型&&length>0返回false
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import indexOf from 'lodash/indexOf';

/**
 * @param {*} authorities 用户拥有角色
 * @param {*} permissions 路由授权角色
 */
const checkPermissions = (authorities, permissions) => {
  // 如果没有设置路由授权角色，直接返回true
  if (isEmpty(permissions)) {
    return true;
  }

  // 如果用户拥有多个角色组成的数组
  if (isArray(authorities)) {
    for (let i = 0; i < authorities.length; i += 1) {
      if (indexOf(permissions, authorities[i]) !== -1) {
        return true;
      }
    }
    return false;
  }

  // 如果用户只拥有一个角色字符串
  if (isString(authorities)) {
    return indexOf(permissions, authorities) !== -1;
  }

  // 如果用户拥有的角色是一个函数
  if (isFunction(authorities)) {
    return authorities(permissions);
  }

  throw new Error('[react-acl-router]: Unsupport type of authorities.');
};

export default checkPermissions;
