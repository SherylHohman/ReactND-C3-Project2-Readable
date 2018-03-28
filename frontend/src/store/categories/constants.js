// ACTION TYPES
 export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
 export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
 export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';


// CONSTANTS

  // For consistancy:
    // Add a "category" definition for the home page: posts for "All" Categories
    // This definition mimics the "categories" defined on server.
    // See also viewData/constants ROUTER - home page is used to display All Categories

  export const ALL_POSTS_CATEGORY = {name: '', path: ''};


// TODO: consider this format for exporting actionTypes
  // export default categories_ActionTypes = {
  //  const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
  //  const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
  //  const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';
  // }
