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

  // ensure consistancy
  const ALL_POSTS_CATEGORY= {name: '', path: ''}
  const ALL_POSTS_ID  = '' ;  // or null ??
  const ALL_POSTS_URL = '/';
  const DEFAULT_SORT_BY = 'date';

  export const HOME  = {
    id: ALL_POSTS_ID,
    url: ALL_POSTS_URL,
    category: ALL_POSTS_CATEGORY,
  }

// ACTION CREATORS

  export const changeView = (newViewData=HOME) => {
    console.log('___in changeView, newViewData:', newViewData);

    // changeView By Category

    if (newViewData.category) {
      console.log('___in changeView By Category, newViewData.category:', newViewData.category);

      const category = (newViewData.category.name)  // '' or null
        ? newViewData.category
        : ALL_POSTS_CATEGORY;

      // url and id are NOT independant of category, set them to ensure in synch
      const url = (category.name)
                  ? `/category/${category.path}`
                  : ALL_POSTS_URL
      const id = category.name;

      return ({
        type: SELECT_CATEGORY,
        url,
        id,
        category,
      });

    // changeView By: url, id

    } else {
      console.log('___in changeView, via id, url:', newViewData);
      // potential issue: if url is a category url, and/or id is a category..
      // the sticky category (object) won't get updated !!
      // The fix: parse URL. If it is '/category/:category', then treat it as
      // changeViewBCagetory ('SELECT_CATEGORY' above)
      return ({
        type: CHANGE_VIEW,
        url:  newViewData.url,
        id:   newViewData.id,
      })
    }
  }

  // "persistent" settings:

  // Embededed selectCategory into changeView - as it's not independant
  // export const selectCategory = (categoryObject) => ({
  //   // could push the new URL here, or in the View.
  //   type: SELECT_CATEGORY,
  //   category: categoryObject,
  //   id: categoryObject.name,
  // })

  export const sortBy = (sortBy='date') => ({
    // TODO: add this field to (browser) url ??
    //   if so, then would need to push the new URL
    // TODO: either validate the param given,
    //       or use sortByMethods to populate Component
    type: SORT_BY,
    sortBy,
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
  switch (action.type) {

    case CHANGE_VIEW:
      console.log("CHANGE_VIEW, action:", action);
      // potential issue: if url is a category route, or id is category.name
      //       then viewData's "category" (object) won't get updated.
      // TODO: parse URL and call selectCategory action creator instead.
      return ({
                ...state,
                url: action.url,
                id: action.id,
              });

    case SELECT_CATEGORY:
      console.log('SELECT_CATEGORY, action:', action);

      // let url = action.url ||
      let url = (action.category.name)
                  ? `/category/${action.category.path}`
                  : '/'    // home page: all categories
      // let id = action.id || action.category.name;
      let id = action.category.name;
      return ({
                ...state,
                url,
                id,
                category: action.category,
            });

    case SORT_BY:
      return ({
                ...state,
                // TODO sort method stored in url ??
                sortBy: action.sortBy,
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


//  NOTE, I only need either url OR filsters: id/cateogry/sortBy.
//    I'm experimenting to seewhich I prefer.
//    URL prpbably better long term or in a more complex app.
//    In this simple app, `selected` requires less code to reach the data
//    once in mapStateToProps.
//    Also, there may be difficulty pulling Router "location" info from store.
//    And they say it's asynch, so it may not update when expected.
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

/*
  //  what happened
      CHANGE_LOCATION or CHANGE_VIEW or CHANGE_URL
      export const  CHANGE_LOCATION = 'CHANGE_LOCATION';

  // UPDATE_CURRENT_FOCUS or UPDATE_CURRENT or CHANGE_VIEW or CHANGE_SELECTED or ..
      export function changeLocation

  */
