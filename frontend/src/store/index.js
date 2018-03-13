import { combineReducers } from 'redux';
import categories from "./categories";
import posts from "./posts";
import comments from "./comments";
import user from "./user";
import viewData from './viewData';

const rootReducer = combineReducers({
  categories,
  posts,
  comments,
  user,
  viewData,
});

export default rootReducer;

// TODO: create root Selectors

//  This file collects all the reducers, so src/index.js
//  can simply use `import * as reducers from './state'`)
//  for `combineReducers`
//    which is used to initialize the Redux Store

// ---------------------------------

// IF combine reducers in index.js instead of here, use this syntax instead:

// export { default as categories } from "./categories/reducers";
// export { default as posts } from "./posts/reducers";
// export { default as comments } from "./comments/reducers";
// export { default as user } from "./user/reducers";
