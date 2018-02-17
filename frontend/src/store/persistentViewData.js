// ACTION TYPES
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const SORT_BY = 'SORT_BY';
// export const SORT_ORDER = 'SORT_ORDER'; // Descending, Ascending

// Valid Values

  // "categoryPath" is a url-safe string for the category url. Not including'/''.
  // values are:
  // HOME.category.path, and all
  // categories.name values

  // TODO: Map over these to populate the Heading/Sort Options in the UI
  export const sortMethods = [
    {sortBy: "date", text: 'Most Recent'},
    {sortBy: "voteScore", text: 'Highest Votes'}
  ];
  export const sortOrder = [
    {sortOrder: "descending", text: 'High to Low'},
    {sortOrder: "ascending",  text: 'Low to High'}
  ];

  // TODO: get paths from App.js, then use to populate App.js
  export const routes = [
    {route: '/:filter?',                       label: 'home'}, // or 'posts' ?
    {route: '/category/:categoryPath', label: 'category'},
    {route: '/post/:postId',           label: 'post'},
    {route: '/post/:postId/edit',      label: 'edit-post'},
    {route: '/post/new',               label: 'new-post'},
  ];

  // ensure consistancy
  const ALL_POSTS_CATEGORY= {name: '', path: ''}
  const ALL_POSTS_ID  = '' ;
  const ALL_POSTS_URL = '/';
  export const DEFAULT_SORT_BY = 'date';
  export const DEFAULT_SORT_ORDER = 'high_to_low';

  export const HOME  = {
    id: ALL_POSTS_ID,
    url: ALL_POSTS_URL,
    category: ALL_POSTS_CATEGORY,
  }

// ACTION CREATORS

  export const changeCategory = (newCategoryPath=HOME.category.path, prev=null) => {
    if (prev && newCategoryPath===prev) {
      console.log('___in changeCategory, NO CHANGE newCategoryPath, prev:', newCategoryPath, prev);
      return;  // NOTHING TO DO
    }
    console.log('___in changeView By Category, newCategoryPath.category:', newCategoryPath.category);
    return ({
      type: SELECT_CATEGORY,
      //  TODO refactor components to use below instead of above
      categoryPath: newCategoryPath,
    });
  }

  export const changeSort = (sortBy=DEFAULT_SORT_BY) => ({
    // TODO: add this field to (browser) url ??
    //   if so, then would need to push the new URL
    // TODO: either validate the param given,
    //       or use sortByMethods to populate Component
    type: SORT_BY,
    sortBy,
  })

  // export const sortOrder = (sortOrder=DEFAULT_SORT_ORDER) => ({
  //   type: SORT_ORDER,
  //   sortOrder: 'DESCENDING'
  // })

// DATA, INITIAL, SAMPLE

  // Assumes starts app from from Home Page url.
  const initialState = {
    categoryPath: HOME.category.path,
    // 'votes' or 'date'
    sortBy:    DEFAULT_SORT_BY,
    sortOrder: DEFAULT_SORT_ORDER,
  }

function persistentViewData(state=initialState, action){
  // console.log('entering reducer persistentViewData, action:', action, 'prevState');
  // console.log('_ entering reducer persistentViewData, action:', action);

  switch (action.type) {
    case SELECT_CATEGORY:
      // console.log('SELECT_CATEGORY, action:', action);
      return  ({
                ...state,
                categoryPath: action.categoryPath,
              });
    case SORT_BY:
      return  ({
                ...state,
                // TODO sort method stored in url ??
                sortBy: action.sortBy,
              });
    default:
      return state;
  }
};

export default persistentViewData
