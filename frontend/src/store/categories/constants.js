// ACTION TYPES
  export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
  export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
  export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';

// CONSTANTS
  export const ALL_POSTS_CATEGORY= {name: '', path: ''};
  // For consistancy,
  // Add a "category" definition for the home page: posts for "All" Categories
  // ALL_POSTS_CATEGORY compliments the "categories" defined on server,
  // could be: {name: 'All', path:''} // name is the display name for the category
