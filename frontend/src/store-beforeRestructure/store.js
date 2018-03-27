/*
    ******** NOT USING THIS FILE **********
    It's here as an example of how another app uses this file

    Aside:
    I have no idea how they are using the WINDOW OBJECT to inject
    INITIALSTATE into their app.  But I definitely like the idea!
    During Prelim app development (before API hookup),
      (and even before I get STORE hooked up..)
      I've got some constants I *can* summon to get some temp data

    NOTE: their index.js differs from mine in the following (significant) way:

--------------------
my index.js includes the following
--------------------

  import { createStore } from 'redux';
  import reducer from './reducers';

  const store = createStore(
    reducer,
     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );


-------------------
their index.js included the following instead
--------------------

  import configureStore from "../app/state/store";

  const reduxStore = configureStore( window.REDUX_INITIAL_DATA );


--------------------
Their store.js
--------------------

  import { createStore, applyMiddleware, combineReducers } from "redux";
  import * as reducers from "./ducks";
  import thunkMiddleware from "redux-thunk";
  import { apiService, createLogger } from "./middlewares";

  export default function configureStore( initialState ) {
      const rootReducer = combineReducers( reducers );

      return createStore(
          rootReducer,
          initialState,
          applyMiddleware(
              apiService,
              thunkMiddleware,
              createLogger( true ),
          ),
      );
  }


--------------------

    ******** end
*/
