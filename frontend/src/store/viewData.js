// import { DELETE_POST_SUCCESS } from './posts';
// import { DELETE_COMMENT_SUCCESS } from './comments';


// ACTION TYPES
export const CHANGE_VIEW = 'CHANGE_VIEW';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const SORT_BY = 'SORT_BY';
// export const SORT_ORDER = 'SORT_ORDER'; // Descending, Ascending


// Valid Values
  // TODO: Map over these to populate the Heading/Sort Options in the UI
  export const sortMethods = [
    {sortBy: "date", text: 'Most Recent'},
    {sortBy: "voteScore", text: 'Highest Votes'}
  ];

  // export const sortOrder = ['decending', 'ascending'];

  // TODO: get paths from App.js, then use to populate App.js
  export const routes = [
    {path: '/', label: 'home'}, // or 'posts' ?
    {path: '/', label: 'home'},
    {path: '/', label: 'home'},
    {path: '/', label: 'home'},
    {path: '/', label: 'home'},
  ];

  // "id" is one of: post.id, comment.id, category.name
  // "url" is an exact path, as per browser window
  // "route" is a route format, where `:` prefix represents a variable name
  // "sortOrder" is "Ascending" or "Descending". Not implemented.
  // "category.path" is a url-safe string for the category url. Not including'/''

  // ensure consistancy
  const ALL_POSTS_CATEGORY= {name: '', path: ''} // name '' or null ??
  const ALL_POSTS_ID  = '' ;  // or null ??
  const ALL_POSTS_URL = '/';
  export const DEFAULT_SORT_BY = 'date';

  export const HOME  = {
    id: ALL_POSTS_ID,
    url: ALL_POSTS_URL,
    category: ALL_POSTS_CATEGORY,
  }

// ACTION CREATORS

  export const changeView = (newViewData=HOME) => {
      // console.log('____entering viewData.changeView, newViewData:', newViewData.category);

    // changeView By Category
    const newCategory = newViewData.persistentCategory //|| null
    if (newCategory) {
      // console.log('___in changeView By Category, newViewData.category:', newViewData.category);

      const category = (newCategory.name)  // '' or null
        ? newCategory
        : ALL_POSTS_CATEGORY;

      // url and id are NOT independant of category, set them to ensure in synch
      const url = (category.name)
                  ? `/category/${category.path}`
                  : ALL_POSTS_URL
      const id = category.name;

      return ({
        type: SELECT_CATEGORY,
        currentUrl: url,
        currentId: id,
        persistentCategory: category,
      });

    // changeView By: url, id

    } else {
      // console.log('___in changeView-via-id,-rl, newViewData:', newViewData);

      // potential issue: if url is a category url, and/or id is a category..
      // the sticky category (object) won't get updated !!
      // The fix: parse URL. If it is '/category/:category', then treat it as
      // changeViewBCagetory ('SELECT_CATEGORY' above)
      return ({
        type: CHANGE_VIEW,
        currentUrl:  newViewData.currentUrl,
        // if not supplied, 'null' tells reducer to use "persistentCategory"
        currentId:   newViewData.currentId || null,
      })
    }
  }

  export const sortBy = (persistentSortBy='date') => ({
    // TODO: add this field to (browser) url ??
    //   if so, then would need to push the new URL
    // TODO: either validate the param given,
    //       or use sortByMethods to populate Component
    type: SORT_BY,
    persistentSortBy,
  })

  // export const sortOrder = ({  }) => ({
  //   type: SORT_ORDER,
  //   sortOrder: 'DESCENDING'
  // })


// DATA, INITIAL, SAMPLE

    // Assumes starts app from from Home Page url.
    // TODO read from react-router or Browser Window
    // TODO: set url, id with data from browser URL
    // TODO: parse url, and set sticky: category and sortBy from browser URL

  const initialState_ViewData = {
    // "current" FIELDS WILL GO AWAY, when can read/parse data from Browser Fields
    currentUrl: HOME.url,
    // holds: post.id, comment.id, or category.name, or '' (all posts)
    currentId:  HOME.id,
    // object eg: {name: 'react', path: 'react'}
    persistentCategory: HOME.category,
    // 'votes' or 'date'
    persistentSortBy:   DEFAULT_SORT_BY,
  }

function viewData(state=initialState_ViewData, action){
  // console.log('entering reducer viewData, action:', action, 'prevState');

  let id;
  let url;
  switch (action.type) {
    case CHANGE_VIEW:
      // console.log("__CHANGE_VIEW, action:", action);

      // potential issue: if url is a category route, or id is category.name
      //       then viewData's "category" (object) won't get updated.
      // TODO: parse URL and call selectCategory action creator instead.
      id = (action.currentId === null)
        ? state.persistentCategory.name
        : action.currentId
      return ({
                ...state,
                currentUrl: action.currentUrl,
                currentId: id,
              });

    case SELECT_CATEGORY:
      // console.log('SELECT_CATEGORY, action:', action);
      let category = action.persistentCategory;
      url = (category.name)
                ? `/category/${category.path}`
                : '/'    // home page: all categories
      id = category.name;
      return ({
                ...state,
                currentUrl: url,
                currentId: id,
                persistentCategory: category,
            });

    case SORT_BY:
      return ({
                ...state,
                // TODO sort method stored in url ??
                persistentSortBy: action.persistentSortBy,
            });

    // case DELETE_POST_SUCCESS:
    //     // Show "posts" page for category from deleted post.
    //     // Sending a "changeView" from the deletePost handler in Post Component
    //     // instead, because I don't have access to the categories Array here
    //     // Although, maybe Categories reducer could dispatch changeView
    //     //   in reaction to DELETE_POST_SUCCESS, using post.categoryName
    //     //   to dispatch another DELETE_POST_SUCCESS, or CHANGE_VIEW
    //     //   with action.categories AND action.categoryName..
    //     // That sounds too convoluted.
    //     //   and I prefer (currently) to use reducers for changing state data
    //     //   only.  Hmm.. maybe calling action creators from reducers is OK.

    //     // // TODO: how to access store.categories ??
    //     const categoryPath = store.categories  // TODO ??
    //         .find((category) =>  category.name === action.categoryName)
    //         .path;
    //     return ({
    //           ...state,
    //           url: `/category/${categoryPath}`,  // (path can differ from name)
    //           id: `${action.categoryName}`,
    //         });
    // case DELETE_COMMENT_SUCCESS:
    //   // TODO
    //   return state;

    default:
      return state;
  }
};

export default viewData


//  NOTE, I only need either url OR filters: id/cateogry/sortBy.
//
//  The other option is to pull it off the history object. or Window object.
//  Finally, this app is simple, so I can "just" pass the url whenever the
//  user clicks a link. That's duplicating logic, but probably easy enough.

//  Tougher question is getting the initial URL when the app is fired up.
//  Or if user types an address into the address bar. Or presses the
//  "back" button.. all the things react-router-dom is giving me !!

//  Really don't want to duplicate Router logic.
//  Best would be to access URL from Router's Source Of Truth.
//  Both these other options could fall out of synch when the address changes, outside a "<Link>" (or push) action from WITHIN my app.
