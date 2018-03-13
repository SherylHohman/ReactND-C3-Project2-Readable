import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';    // not using..yet anyway (see Notes) below
import rootReducer from './store/index.js';
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
    <App />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();
