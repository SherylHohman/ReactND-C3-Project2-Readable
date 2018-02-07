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

  // TODO: get paths from App.js
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


// ACTION CREATORS

  // temporal view settings:
  const changeViewDefaults = {
    url: '/',      // home === Posts, all categories
    id:  null,     // either: post.id, comment.id, or category.name
    // // persistent data
    // category: '',  // all categories
    // sortBy: 'date',
  }

  export const changeView = (newViewData=changeViewDefaults) => {
    console.log('in changeView, newViewData:', newViewData);

    if (newViewData.category) {
      const category = (newViewData.category.name)  // '' or null
        ? newViewData.category
        : {...changeViewDefaults, category: ''};  // home page, all cagetories
      return ({
        type: SELECT_CATEGORY,
        category,
        // reducer also sets url and id appropriately, as they are dependant
      });
    } else {
      return ({
        // potential issue: if url is a category url, and/or id is a category..
        // the sticky category (object) won't get updated !!
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
  const sampleHomePage = {

    // current view, non-persistant fields
    // Assumes user starts app from the home page
    // Better to check the Browser url
    // THESE FIELDS WILL GO AWAY, when read/parse Browser Fields
    url: '/',  // home page
    id: '',    // all posts (no category filter)

    // persistent - can restore settings upon return to relevant view
    sortBy: 'date',   // ?? '', null, 'none'
    category: ''      // ?? '', null, 'none', 'all'
  }

  // TODO: Uncomment, after set lint directive to not Warn about Unused
    // (this section only)
    // const samplePostOrCommentPage = {
    //   url: '/post',   // also format for edit/new comment or post
    //   id: '8xf0y6ziyjabvozdd253nd', // post.id; also use for comment.id
    // }
    // const sampleCategoryPage = {
    //   url: '/category/react',  // '/category/:categoryPath'
    //   id: 'react'              // categoryName
    //   filter: {
    //     category: {name: 'react', path: 'react'},
    //     sortBy: 'votes'
    //   },
    // }

  const initialState = {
    // TODO: set url, id with data from browser URL
    // TODO: parse url, and set sticky: category and sortBy from browser URL
    ...sampleHomePage
  };


function viewData(state=initialState, action){
  switch (action.type) {
    case CHANGE_VIEW:
      // potential issue: if url is a category route, or id is category.name
      //       then viewSettings.category (object) won't get updated.
      // TODO: parse URL and call selectCategory action creator instead.
      return ({
                ...state,
                url: action.url,
                id: action.id,
              });
    case SELECT_CATEGORY:
      const url = (action.category)
                 ? `/category/${action.category.path}`
                 : '/'
      return ({
                ...state,
                url,
                id: action.category.name,
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


//  NOTE, I only need either url OR filter.
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



/*  NAMING THOUGHTS..

    url,
    filter: postId, commentId, {category, sortBy}

  // experiment with using both options.
  // Only 1 would be needed (either url, OR filter)

  name of this object to be placed on `store`:
  If I use, or include, `url` as a key/property,
    then "selected" doesn't make sense idiomatically.
    neither does "filter".
    But they *would* work for the name of key *on* the object.

  call this:
    selected, or state, or url or localData, OR localState,
    current, currentData,  appState,  view, , page,  location,  locationState,
    locationData,  selectedData,  filterProps,  transient,  emigrate,  ephemeral,
    stateData, selectedState, currentState, currentData, prop, viewData, componentData,
    ropData, locationData, locationProps, componentProps, viewProps, propsToPass,
    transientProps, transientData, viewData

  `selected` works, or `filter`. Unless I also have a url prop.


//  what happened
CHANGE_LOCATION or CHANGE_VIEW or CHANGE_URL
export const  CHANGE_LOCATION = 'CHANGE_LOCATION';

// UPDATE_CURRENT_FOCUS or UPDATE_CURRENT or CHANGE_VIEW or CHANGE_SELECTED or ..

export const UPDATE_CURRENT_FOCUS

export function changeLocation
export function viewData

*/
