import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import { combineReducers } from 'redux';
// import * as reducers from "./state/index.js";     // might rename folder to `store`
import rootReducer from './state/index.js';
import App from './components/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,   // preloaded state
  composeEnhancers(
    applyMiddleware(thunk)
  )
);


ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();
