import { combineReducers } from 'redux';
import categories from "./categories/ducks";
import posts from "./posts/ducks";
import comments from "./comments/ducks";
import user from "./user/ducks";
import viewData from '../state/viewData/ducks';

const rootReducer = combineReducers({
  categories,
  posts,
  comments,
  user,
  viewData,
});

export default rootReducer;


// IF combine reducers in index.js instead of here, change to:

// export { default as categories } from "./categories/reducers";
// export { default as posts } from "./posts/reducers";
// export { default as comments } from "./comments/reducers";
// export { default as user } from "./user/reducers";

// ---------------------------------

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

