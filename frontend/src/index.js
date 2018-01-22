import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';  // remove or combine (see Notes)
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';    // not using..yet anyway (see Notes) below
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

    <BrowserRouter><App/></BrowserRouter>
    {/*<BrowserRouter><Route path="/:filter?" component={App}/></BrowserRouter>*/}

  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();


// Notes:

//  TODO: not using thunk: refactor without using:
//    DEVTOOLS...COMPOSE, composeEnhancers, compose, or applyMiddleware
//    ..or refactor app to use thunks

//  TODO: testing (or learning) see if other version of `BrowserRouter..`
//    line of code is equivalent. Then remove one version, and edit/remove
//    the import statement(s) as appropriate.
