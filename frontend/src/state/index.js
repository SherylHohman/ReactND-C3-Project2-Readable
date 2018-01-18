export { default as categories } from "./categories/reducers";
export { default as posts } from "./posts/reducers";
export { default as comments } from "./comments/reducers";
export { default as user } from "./user";

/*

  OR Maybe do this here instead, and just import rootReducer into src/index.js

------------

import { combineReducers } from 'redux';

export default combineReducers({
  categories,
  posts,
  comments,
  user
})

-------------
*/


//  collects the reducers from the named folders
//  imported by src/index.js  (`import * as reducers from './state'`)
//  to be used with combineReducers
//    to be used to initialize the Redux Store

// all "ducks-ish" reducers from folders in "state".
//  Perhaps should wrap all those folders into a "ducks" folder?
//    or just rename those "reducers,js" files to "ducks.js",
//    as I have actionTypes, actionCreators, and reducers all in the same file.
//  It's also possible that I'm not applying "ducks" correctly.
//  I think the actions and reducers are supposed to still be in separate files
//    (or maybe it's just the more common convention, esp for larger apps)

