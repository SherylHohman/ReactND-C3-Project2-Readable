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
  export const sortOrder = [
    {sortOrder: "descending", text: 'High to Low'},
    {sortOrder: "ascending",  text: 'Low to High'}
  ];

  // export const sortOrder = ['decending', 'ascending'];

  // TODO: get paths from App.js, then use to populate App.js
export const ROUTES= {
  home:     {
    // full:     '/',
    base:     '/',
    param:    '/:filter?',
  },
  category: {
    base:     '/category/',
    param:    ':categoryPath',
  },
  post:     {
    base:     '/post/',
    param:    ':postId',
  },
  editPost: {
    // full:  '/post/:postId/edit',
    base:     '/post/edit/',
    param:    ':postId',
  },
  newPost:  {
    base:     '/post/new',
    param:    '',
  },
}

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
  export const DEFAULT_SORT_ORDER = 'high_to_low';

  export const HOME  = {
    id: ALL_POSTS_ID,
    url: ALL_POSTS_URL,
    category: ALL_POSTS_CATEGORY,
  }

  // TODO: move uri into store
  // TODO: maybe change "uri" to a different name: currentViewData, or something
  export function getUri(routerProps=null, store=null){
    const match    = (routerProps && routerProps.match)    || null;
    const location = (routerProps && routerProps.location) || null;

    // Use STORE  if component does NOT have routerProps
    if (!match && !store) {
      console.log('getUri, no "match" object - possibly a child component that routeProps was not passed as props'); //return null;  //exit early
      console.log('Try passing in "store" as a second parameter to "getUri" as a fallback');
      // pull info from viewData, which should be kept in synch with url by component's owner
      return null;
    }
    // child component does not have routerProps, use "store" (2nd param)
    if (store) {
      console.log('Using "store.viewData", some expected uri fields will be missing.');
      return ({
        url: store.viewData.url,
        currentId: store.viewData.currentId,
        // these values I cannot get from viewData, but
        //   they *should not* be needed by child components
        // route: null,
        // params: null,
        // categoryPath: null,
        // postId: null,
      });
    }
    // else {console.log('___routerProps.match', routerProps.match);}
    // if (!location) return null;  //exit early  // not using location, currently

    // Home page format is different than other routes
    // It will "FAKE" some data for consistency/continuity with other routes
    if ( (match.path === ROUTES.home) ||
         (match.path === HOME.url)
       ) {
      let uri = {
        route:  match.path || ROUTES['home'].route || HOME.url || null,
        // DO NOT use match.url when on the HOME route !!
        url:    HOME.url, //location.pathname || null,

        // TODO: remove params. that's a router thing.  I don't need it directly
        //   instead, I just want the "param" items DIRECTLY on my uri object
        params: {
          ...match.params,  // does this work if match.params is undefined/null ?
          // add a FAKE match param for the categoryPath
          categoryPath: HOME.category.path,
        },

        // postId: match.params.postId || null,
        ...match.params,
        categoryPath: HOME.category.path || null,

        // TESTING to replace postId and categoryPath above
        currentId: match.params.postId || match.params.categoryPath || HOME.category.path,
      }
      // delete derived params, when they do not (exist at)/(reflect data for)
      //   current view/url
      if (uri.postId       === null) {delete uri.postId}
      if (uri.categoryPath === null) {delete uri.categoryPath}
      if (uri.currentId    === null) {delete uri.postId}

      return uri;
    }

    // All other routes -- (don't need to make up data)
    // Copy values from routerProps directly
    // console.log('getUri, All Other Routes: routerProps.match', routerProps.match);
    let uri = {
      route:  match.path   || ROUTES.label['home'].route,
      url:    match.url    || location.pathname || null,

      // TODO: get rid of params, key, just put the values in directly
      params: match.params || null,

      // copy the key-value pairs form match.params DIRECTLY onto uri.
      postId:       match.params.postId       || null,
      categoryPath: match.params.categoryPath || null,
      // ...match.params,  // == either postId or categoryPath

      // TESTING "currentId": to replace postId and categoryPath above
      currentId: match.params.postId || match.params.categoryPath || HOME.category.path,

      // TODO: store currentSort info in url (persistent shall still be in Uri)
      //    search: location.search || null,
      // TODO: so can link to location on page (top of comments, add comment, etc)
      //    hash:   location.hash   || null,
    };
    // delete derived params, when they do not (exist on the current view/url)
    if (uri.postId       === null) {delete uri.postId}
    if (uri.categoryPath === null) {delete uri.categoryPath}
    if (uri.currentId    === null) {delete uri.postId}

    return(uri);
  }

// ACTION CREATORS

  const changeView_Home = (uri) => (dispatch) =>  {
    console.log('__on HOME route:', uri.route);
    // on home route params == {filter: undefined}
    //   For continuity, shall to explicitely set the categoryPath
    //   to match expected value, consistent with other paths/components
    //   * Also Adding a FAKE a "categoryPath" param !! *
    dispatch ({
      type: CHANGE_VIEW,
      currentUrl: uri.url,
      currentId:  HOME.category.path,

      // note "params" is Brittle - I overwrite actual params here.
      //   if EVER change routes - this may Break !
      // FAKE THIS - see above notes
      params: {categoryPath: HOME.category.path},  // TODO: retire this category object

      categoryPath: HOME.category.path,

      persistentCategory: HOME.category,    // TODO: retire this category object
      // TODO: refactor components to (below) this instead (of above)
      persistentCategoryPath: HOME.category.path,  //string
    })
  }
  const changeView_Category = (uri) => (dispatch) => {
    console.log('__on CATEGORY route:', uri.route);
    dispatch ({
      type: CHANGE_VIEW,
      currentUrl: uri.url,
      currentId:  uri.params.categoryPath,

      // TODO: retire this object
      persistentCategory: {
        name: uri.params.categoryPath,  // technically incorrect!!
        // (above) don't have access to categories to parse this properly.
        //  It's the same value in MY dataset (currently)
        path: uri.params.categoryPath,  // { name, path }
      },

      // TODO: refactor components to use below instead of persistentCategory
      persistentCategoryPath: uri.params.categoryPath,  //string
    })
  }
  const changeView_Post = (uri) => (dispatch) => {
    console.log('__on POST route:', uri.route);
    dispatch ({
      type: CHANGE_VIEW,
      currentUrl: uri.url,
      currentId:  uri.postId,
    })
  }

  export function changeView(newViewData=HOME) { //=> (dispatch) => {
    return (dispatch) => {

      console.log('____entering viewData.changeView, newViewData:', newViewData);

      // changeView By uri
      const uri = newViewData.uri;
      if (!uri){ console.log('Must REFACTOR to pass in a "uri" to viewData.changeView');}
      else{console.log('__have new uri:', uri);}

      // HOME PAGE
      if (uri.route ==="/" || uri.route==="/:filter?"){
          console.log('__on HOME route:', uri.route);
          dispatch(changeView_Home(uri));
      }
      // by uri: postId (url begins with ROUTES..)
      else if (uri.route.indexOf(ROUTES.post.base) === 0) {
         dispatch(changeView_Post(uri));
      }
      // by uri: category (url begins with ROUTES..)
      else if (uri.route.indexOf(ROUTES.category.base) === 0) {
          console.log('__on CATEGORY route:', uri.route);
          dispatch(changeView_Category(uri));
      }
      // No Matching Base Route
      else {
          console.log('ERROR WITH THE ROUTE:', uri.route);
          dispatch({
            type: 'INVALID ROUTE CANNOT CHANGE_VIEW',
          })
      }
  } // dispatch wrapper
}

  export const changeSort = (persistentSortBy='date') => ({
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

  const initialState_ViewData = {
    currentUrl: HOME.url,
    // holds: post.id, comment.id, or category.name, or '' (all posts)
    currentId:  HOME.id,

    persistentCategory: HOME.category,  // TODO: retire this object
    //  TODO refactor components to use this string
    persistentCategoryPath: HOME.category.path,

    // 'votes' or 'date'
    persistentSortBy:    DEFAULT_SORT_BY,
    persistentSortOrder: DEFAULT_SORT_ORDER,
  }

function viewData(state=initialState_ViewData, action){
  // console.log('entering reducer viewData, prevState', state);
  console.log('entering reducer viewData, action:'  , action);

  let id;
  let url;
  switch (action.type) {
    case CHANGE_VIEW:
      console.log("__CHANGE_VIEW, action:", action);

      // potential issue: if url is a category route, or id is category.name
      //       then viewData's "category" (object) won't get updated.
      // TODO: parse URL and call selectCategory action creator instead.

      id = (action.currentId === null)
        ? state.persistentCategory.path
        : action.currentId
      console.log('__CHANGE_VIEW, action.currentUrl, id', action.currentUrl, id)
      return  ({
                ...state,
                currentUrl: action.currentUrl,
                currentId:  id,
                persistentCategory: action.persistentCategory,
                persistentCategoryPath: action.persistentCategoryPath,
              });

    case SELECT_CATEGORY:
      // console.log('SELECT_CATEGORY, action:', action);
      let category = action.persistentCategory;
      url = (category.path)
                ? `${ROUTES.category.base}${category.path}`
                : `${HOME.url}`    // home page: all categories
      id = category.path;
      return  ({
                ...state,
                currentUrl: url,
                currentId: id,
                persistentCategory: category,
                persistentCategoryPath: action.persistentCategoryPath,
              });

    case SORT_BY:
      console.log('SORT_BY, action:', action);
      return  ({
                ...state,
                // TODO sort method stored in url ??
                persistentSortBy: action.persistentSortBy,
              });

    default:
      return state;
  }
};

export default viewData
