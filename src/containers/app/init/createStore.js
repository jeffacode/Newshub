import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from 'redux';
import {
  connectRouter,
  routerMiddleware,
} from 'connected-react-router';
import thunk from 'redux-thunk';
import asyncActionMiddleware from 'redux/middlewares/asyncActionMiddleware';
import reducers from 'redux/modules/';

function createAppStore(history, preloadedState = {}) {
  // enhancers
  let composeEnhancers = compose;

  // eslint-disable-next-line no-underscore-dangle
  if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    // eslint-disable-next-line no-underscore-dangle
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }

  // 添加router节点，只记录react-router的location对象
  const rootReducer = combineReducers({
    router: connectRouter(history),
    ...reducers,
  });

  // middlewares
  const middlewares = [
    routerMiddleware(history),
    thunk,
    asyncActionMiddleware,
  ];

  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  return store;
}

export default createAppStore;
