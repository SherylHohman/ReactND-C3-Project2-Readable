import { combineReducers } from 'redux';
import categories from "./categories/reducers";
import posts      from "./posts/reducers";
import comments   from "./comments/reducers";
// import user       from "./user";
import viewData   from './viewData/reducers';

const rootReducer = combineReducers({
  categories,
  posts,
  comments,
  // user,   // TODO: implement
  viewData,
});

export default rootReducer;

// TODO: create root Selectors

//  This file collects all the reducers, so src/index.js
//    rootReducer is used to initialize the Redux Store

// IF combine reducers in index.js instead of here, use this syntax instead:

  // export { default as categories } from "./categories/reducers";
  // export { default as posts } from "./posts/reducers";
  // export { default as comments } from "./comments/reducers";
  // export { default as user } from "./user/reducers";
