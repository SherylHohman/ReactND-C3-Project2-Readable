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

//  Perhaps instead have a ducks folder, and each file that is currently a "duck"
//    could instead be named for the reducer that is exported by default.
//    Hmm.. I like this.  Makes imports easier.
//    And since I have No Other Files, they would all be easier to access.
//      That could change, though, if I add tests, or separate Reducers
//      from Actions, Types, and Action Creators into their own files.

//  It's also possible that I'm not applying "ducks" correctly.
//  I think the actions and reducers are supposed to still be in separate files
//    (or maybe it's just the more common convention, esp for larger apps)

// ---------------------------------

// IF combine reducers in index.js instead of here, use this syntax instead:

// export { default as categories } from "./categories/reducers";
// export { default as posts } from "./posts/reducers";
// export { default as comments } from "./comments/reducers";
// export { default as user } from "./user/reducers";
