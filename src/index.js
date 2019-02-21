import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { createStore, createApp, initApp } from 'containers/app/';
import './style.scss';
import 'antd/dist/antd.css';

// 创建history
const history = createBrowserHistory();

// 创建store
const store = createStore(history);

// 创建app
const app = createApp(store, history);

// 初始化app
initApp(store.dispatch);

ReactDOM.render(app, window.document.getElementById('app'));
