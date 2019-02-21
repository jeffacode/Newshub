import { combineReducers } from 'redux';
import notices from './notices';

const entitiesReducer = combineReducers({
  notices,
});

export default entitiesReducer;
