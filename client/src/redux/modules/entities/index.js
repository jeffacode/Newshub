import { combineReducers } from 'redux';
import notices from './notices';
import subscriptions from './subscriptions';
import news from './news';
import category from './category';

const entitiesReducer = combineReducers({
  notices,
  subscriptions,
  news,
  category,
});

export default entitiesReducer;
