import { combineReducers } from 'redux';
import notices from './notices';
import subscriptions from './subscriptions';
import newsList from './newsList';
import topic from './topic';
import searchResults from './searchResults';

const entitiesReducer = combineReducers({
  notices,
  subscriptions,
  newsList,
  topic,
  searchResults,
});

export default entitiesReducer;
