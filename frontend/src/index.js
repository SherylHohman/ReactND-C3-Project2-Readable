import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { combineReducers } from 'redux';
import * as reducers from "./state/index.js";     // might rename folder to `store`
import App from './components/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';


// TODO: check syntax
const rootReducer = combineReducers( reducers );

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();
