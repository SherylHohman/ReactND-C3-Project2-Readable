import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import registerServiceWorker from './registerServiceWorker';

//  Middlewares
import thunk  from 'redux-thunk';
// optionally imported below..
// import logger from 'redux-logger'

//  App
import rootReducer from './store/index.js';
import App from './components/App';
import './index.css';

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
  // https://stackoverflow.com/a/48396154/5411817 - 'development' is set by
  //  a webpack script at node_modules react-scripts/scripts/config/env.js,
  //  as per create-react-app (unless decide to `eject` it)
  const { logger } = require(`redux-logger`);
  middlewares.push(logger);
  // Note: logger must be the last middleware in chain,
  //  otherwise it will log thunk and promise, not actual actions (#20).
}

const store = createStore(
  rootReducer,   // preloaded state
  composeEnhancers(
    applyMiddleware(...middlewares)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();
