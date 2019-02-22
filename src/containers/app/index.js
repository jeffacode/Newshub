import { hot } from 'react-hot-loader/root';
import createBrowserHistory from 'history/createBrowserHistory';
import createStore from './init/createStore';
import createApp from './init/createApp';
import initApp from './init/initApp';

// 创建history
const history = createBrowserHistory();

// 创建store
const store = createStore(history);

// 创建App
const App = createApp(store, history);

// 在App渲染前做一些初始化工作
initApp(store.dispatch);

export default hot(App);
