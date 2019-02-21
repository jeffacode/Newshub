import omit from 'lodash/omit';

const OMIT_ROUTE_RENDER_PROPERTIES = ['render', 'component']; // 从路由配置中除去这两个字段

const omitRouteRenderProperties = route => (
  omit(route, OMIT_ROUTE_RENDER_PROPERTIES)
);

export default omitRouteRenderProperties;
