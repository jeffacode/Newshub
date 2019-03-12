import { combineReducers } from 'redux';
import notices from './notices';
import subscriptions from './subscriptions';
import newsList from './newsList';
import category from './category';
import searchResults from './searchResults';

const entitiesReducer = combineReducers({
  notices,
  subscriptions,
  newsList,
  category,
  searchResults,
});

export default entitiesReducer;
