import pathToRegexp from 'path-to-regexp';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import filter from 'lodash/filter';

// 将菜单项的path转换成fullpath，fullpath即是菜单项的key
export const getFullPathMenu = (menu, parentPath = '/') => (
  map(menu, (item) => {
    const fullPathMenu = {
      ...item,
      path: `${parentPath}${item.path}`,
    };
    if (item.children) {
      fullPathMenu.children = getFullPathMenu(item.children, `${parentPath}${item.path}/`);
    }
    return fullPathMenu;
  })
);


// 返回全部菜单项的keys集合
export const getMenuKeys = fullPathMenu => (
  reduce(fullPathMenu, (menuKeys, item) => {
    menuKeys.push(item.path);
    if (item.children) {
      return menuKeys.concat(getMenuKeys(item.children));
    }
    return menuKeys;
  }, [])
);

// 返回URL包含的子路径集合
export const urlToPaths = (url) => {
  if (url) {
    const paths = url.split('/').filter(i => i);
    return map(paths, (path, index) => `/${paths.slice(0, index + 1).join('/')}`);
  }
  return [];
};

// 返回和URL匹配的菜单项的keys集合
export const getSelectedKeys = (paths, menuKeys) => (
  reduce(paths, (selectedKeys, path) => (
    selectedKeys.concat(filter(menuKeys, menuKey => pathToRegexp(menuKey).test(path)))
  ), [])
);
