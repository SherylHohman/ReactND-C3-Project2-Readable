import changeCategory from './persistentViewData';

// // ACTION TYPES
// export const CHANGE_VIEW = 'CHANGE_VIEW';
// export const SELECT_CATEGORY = 'SELECT_CATEGORY';
// export const SORT_BY = 'SORT_BY';
// // export const SORT_ORDER = 'SORT_ORDER'; // Descending, Ascending


// CONSTANTS, Valid Values, Helpers

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

  // "id" is one of: post.id, comment.id, category.name
  // "url" is an exact path, as per browser window
  // "route" is a route format, where `:` prefix represents a variable name
  // "sortOrder" is "Ascending" or "Descending". Not implemented.
  // "category.path" is a url-safe string for the category url. Not including'/''

  // ensure consistancy
  const ALL_POSTS_CATEGORY= {name: '', path: ''} // name '' or null ??
  const ALL_POSTS_ID  = '' ;  // or null ??
  const ALL_POSTS_URL = '/';
  export const DEFAULT_SORT_BY    = 'date';
  export const DEFAULT_SORT_ORDER = 'high_to_low';

  export const HOME  = {
    id: ALL_POSTS_ID,
    url: ALL_POSTS_URL,
    category: ALL_POSTS_CATEGORY,
  }


  // TODO: use to populate App.js
  export const ROUTES = {
    // home:     '/',
    home:     '/:filter?',
    category: '/category/:categoryPath',
    post:     '/post/:postId',
    editPost: '/post/:postId/edit',
    newPost:  '/post/new',
  };


  // Pulls "uri" data from routerProps
  export function getUri(routerProps=null){
    const match    = (routerProps && routerProps.match)    || null;
    const location = (routerProps && routerProps.location) || null;

    let uri = {};

    if ((match.path === ROUTES.home) || (match.path === HOME.url)){
      // DO NOT USE MATCH for url on HOME route
      uri.url          =  HOME.url;
      // Create this value
      uri.categoryPath =  HOME.category.path;
    }
    else {
    // ONLY IF NOT HOME ROUTE
      uri.url   =  match.url  || location.pathname || ROUTES.home || null;
      uri.categoryPath = match.params.categoryPath || null;
    }

    // SAME FOR ALL ROUTES
    uri.route  = match.path || ROUTES['home'].route || HOME.url || null;
    uri.postId = match.params.postId    || null;
    // ...match.params;  // == either postId or categoryPath

    // Replaces both postId and categoryPath
    uri.currentId = match.params.postId || match.params.categoryPath || HOME.category.path;

    // TODO: store currentSort info in url (persistent shall still be in Uri)
    //    search: location.search || null;
    // TODO: so can link to location on page (top of comments; add comment; etc)
    //    hash:   location.hash   || null;

    // delete derived params, when they do not (exist on the current view/url)
    if (uri.postId       === null) {delete uri.postId}
    if (uri.categoryPath === null) {delete uri.categoryPath}
    if (uri.currentId    === null) {delete uri.postId}

    return(uri);
  }


// ACTION TYPES
  export const CHANGE_LOCATION_FULL= 'CHANGE_LOCATION_FULL';
  export const CHANGE_LOCATION_DIFF= 'CHANGE_LOCATION_DIFF';

// ACTION CREATORS

  export const changeLocation = ( {newRouterProps, prevRouterProps }) => {
    // return (dispatch) => {
      // prevState optional
      // viewData: access persistent values when needed

      // console.log('____entering Uri.locationChanged, newRouterProps prevRouterProps viewData:', newRouterProps prevRouterProps viewData);
      if (!newRouterProps) return {type: 'ERROR_NO_ROUTER_PROPS_GIVEN'};//null;

      //  TODO: If the category changed, fire off a viewDataByCategory to update
      //  PersistentCategoryPath

      // { route, url, params, currentID, postID, categoryPath, persistentCategoryPath } = uri;
      // { route, url, currentID } = uri;  // core
      // { postID, categoryPath, persistentCategoryPath } = uri;  // TESTING

      if (!prevRouterProps){
      const uri = getUri(newRouterProps);
      // TODO: If uri.categoryPath is present, then dispatch persistentCategory;
        if (uri.categoryPath){
        // if only using currentId, then need to check if route is Category Route instead
          console.log('uri, locationChanged, dispatching to update persistentCategoryPath..');
          // dispatch(changeCategory(uriDiff.categoryPath));
          // same for persistent sort, if add sort to the url
        }
        return ({
          type: CHANGE_LOCATION_FULL,
          uri: { ...uri }
        })
      }

      // else, Update only changed items
      // Allows to send CHANGE_VIEW (persistentCategoryPath) if category has changed
      let   uriDiff = getUri( newRouterProps);
      const prevUri = getUri(prevRouterProps);
      const uriKeys = Object.keys(uriDiff);

      for (let key in uriKeys){
        if (prevUri[key] && (uriDiff[key] === prevUri[key])){
          delete uriDiff[key];
        }
      }
      if (uriDiff.categoryPath){
        console.log('uri, locationChanged, dispatching to update persistentCategoryPath..');
        // dispatch(changeCategory(uriDiff.categoryPath));
        // same for persistent sort, if add sort to the url
      }
      return ({
        type: CHANGE_LOCATION_DIFF,
        uri: { ...uriDiff }
      })
    // } // dispatch wrapper
  }

// DATA, INITIAL, SAMPLE

  // Home page, "All Categories"
  const initialState= {
    currentRoute: ROUTES.home,
    currentUrl:   HOME.url,

    // holds: post.id, or category.path, or '' ("home" - all posts)
    // it holds the value of the "active" param
    // (since only 1 param active in app any point in time - currently).
    // Convenience, unnecessary)
    currentId:  HOME.category.path,

    //  these values are unnecessary: currentId handles both
    categoryPath: HOME.category.path,
    //postId:  // does not exist on default route
    //filter:  // unused. gets added by match.params (home route)
  }

// REDUCER

  // formerly known as "uri"
  function currentView(state=initialState, action){
    console.log('_ entering reducer Uri, action:', action);
    console.log('_ entering reducer Uri, prevState:', state);

    switch (action.type) {
      case CHANGE_LOCATION_FULL:
        console.log("uri reducer, CHANGE_LOCATION_FULL, action:", action);
        // const { url, params, route } = action; //core
        // const { currentId, persistentCategoryPath }; //experimental
        return  ({
                  ...action.uri,
                });
      case CHANGE_LOCATION_DIFF:
        console.log("uri reducer, CHANGE_LOCATION_DIFF, action:", action);
        // const { url, params, route } = action; //core
        // const { currentId, persistentCategoryPath }; //experimental
        return  ({
                  ...state,
                  ...action.uri,
                });
      default:
        return state;
    }
  };

export default currentView
