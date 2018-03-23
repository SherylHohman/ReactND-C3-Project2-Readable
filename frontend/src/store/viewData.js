import { createSelector } from 'reselect';

// ACTION TYPES
export const CHANGE_VIEW = 'CHANGE_VIEW';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const SORT_BY = 'SORT_BY';
// TODO: export const SORT_ORDER = 'SORT_ORDER'; // Descending, Ascending

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

  // TODO: change to an Array, then map over it to populate App.js Routes
export const ROUTES= {
  home:     {
    name :    'home',
    route:    '/',
    params:   [],
    base:     '/',
  },
  category: {
    name :    'category',
    route:    '/:categoryPath',
    params :  ["categoryPath"],
    base:     '/',
  },
  post:     {
    name :    'post',
    route:    '/:categoryPath/:postId',
    params :  ["categoryPath", "postId"],
    base:     '/',
  },
  editPost: {
    name :    'editPost',
    route:    '/post/edit/:postId',
    params :  ["postId"],
    base:     '/post/edit/',
  },
  newPost:  {
    name :    'newPost',
    route:    '/post/new',
    params:   [],
    base:     '/post/new/',
  },
};

// See also related Selector Function at end of file
export function calculateRouteUrlFromLoc(loc){
  const routeDef =ROUTES[loc.routeName];
  let routeUrl = routeDef.base;
  if (routeDef.params !== []) {
     for (let param in routeDef.params){
      routeUrl += loc[param] + '/';
    }
    //  remove extra trailing '/'
    routeUrl = routeUrl.slice(0, -1);
  }
  return routeUrl;
}

// used to calculate a url to navigate to, based on routeName supplied by component
export function computeUrlFromLocParamsAndRouteName(loc, routeName){
  if (!routeName) {routeName = loc.route || 'home';}
  let computedUrl = ROUTES[routeName].base;
  for (let param in ROUTES[routeName].params) {
    computedUrl += loc[param];
  }
  return computedUrl;
}
// used to calculate a url to navigate to, based on routeName supplied by component
// paramValues eg: {postId: '6ni6ok3ym7mf1p33lnez'}
//  or {categoryPath: 'react', postId: '6ni6ok3ym7mf1p33lnez'}
export function computeUrlFromParamsAndRouteName(paramValues={}, routeName='home'){
  const requiredParams = ROUTES[routeName].params;
  let computedUrl = requiredParams.reduce((acc, paramName) => {
      acc += paramValues[paramName] + '/';
    return acc;
  }, ROUTES[routeName].base);
  //  remove extra trailing '/' IF added by param loop
  if (requiredParams.length > 0) {
    computedUrl = computedUrl.slice(0, -1);
  }
  return computedUrl;
}

  //  "url" is an exact path, as typed into the browser bar
  //  (params, when exist are:) "categoryPath", "postId"
  //  ("categoryPath" is a url-safe string for the category url. Not including'/'')
  //  "route" is a route format, where `:` prefix represents a variable name
  //    Note: route will be the "matched" part of current route
  //      that determined that component should render,
  //      it is not necessarily the full route for the PAGE being viewed
  //  "sortOrder" is "Ascending" or "Descending". Not implemented.

  // Ensure consistancy: so Home page can easily be referred to as a "category" page,
  //    but its route is not part of category definitions file.
  //    Also, it does not have any params (namely, no "categoryPath" param".
  // ALL_POSTS_CATEGORY compliments the "categories" array defined on server,
  //  adds a "category" definition for the home page: (to show posts for "All" Categories)
  const ALL_POSTS_CATEGORY= {name: '', path: ''};
  const ALL_POSTS_URL = '/';
  export const DEFAULT_SORT_BY = 'date';
  export const DEFAULT_SORT_ORDER = 'high_to_low';

  export const HOME  = {
    url: ALL_POSTS_URL,
    category: ALL_POSTS_CATEGORY,
    categoryPath: ALL_POSTS_CATEGORY.path,
  }

  //  if "routerProps" is provided, loc values are derived from routerProps,
  //  else it returns loc values last saved to the store
  //  (when using routerProps, can pass in "null" instead of "store" as 1st argument)
  export function getLocFrom(store, routerProps=null){
    let loc;
    if (routerProps){
      loc = getLoc(routerProps);
      // console.log('loc from routerProps', loc);
    }
    else {
      if (!store) {
        console.log('ERROR: viewData.getLocFrom, ',
                    'REQUIRES: "(store)" argument, or "(null, routerProps)" as arguments'
                    );
        return null
      };
      loc = store.viewData.loc;
      // console.log('loc from viewData', loc);
    }
    return loc;
  }

  export function getLoc(routerProps=null){
    if (!routerProps){
      console.log('possible Error: viewData.getLoc, invalid routerProps (prob checking for prevRouterProps)')
      // return null;
    }
    const match    = (routerProps && routerProps.match)    || null;
    const location = (routerProps && routerProps.location) || null;
    if (!match) {
      console.log('ERROR: getLoc, no "match" object - possibly a child component that routeProps was not passed as props'); //return null;  //exit early
      // return null;
    }
    const params = !match ? {} : match.params
    const route = (match && match.path) || ROUTES.home.route;

    const getRouteName = route => {
      const routeKeys = Object.keys(ROUTES);
      const matchedRouteKey = routeKeys.find((key) => {
        return ROUTES[key].route === route;  //url
      });
      // TODO: default value for unmatched route: null, '', 'home' ??
        //  (unless there is another '/' in the (bad) url),
        //  usually the matched (bad) route will be /:category
        //  or the url of a deleted post /:categoryPath/:poatId

      // routeName is the same as its key, so could refactor to use key as a shortcut
      return ROUTES[matchedRouteKey].name || 'home' //null;
    };
    const routeName = getRouteName(route);

    const loc = {
      // actual location, not just the "match"ed part
      url: location.pathname,

      // got rid of params key, instead storing params directly on loc
      // ...match.params,
      ...params,

      // note, this is the "matched" route of the calling component
      //   - not necessarily the route for the PAGE in the BROWSER BAR
      //   (for example: if called from within Categories component,
      //     route will ALWAYS be '/' because Categories
      //     "matches" on and renders on ALL routes)
      route,
      routeName,

      // I don't use match.url currently, it's ready if I decide it's needed
      // match: match.url,

    };
    // console.log('viewData.getLoc, loc:', loc);
    return(loc);
  }


  const getRouteFromRouter = createSelector(
    (routerProps=null) => (routerProps.match && routerProps.match.path) || ROUTES.home.route
  );
  const getUrlFromRouter = createSelector(
    (routerProps=null) => (routerProps && routerProps.location.pathname) || null
  );
  const getParamsFromRouter = createSelector(
    (routerProps=null) => !routerProps.match ? {} : routerProps.match.params,
  );
  const getMatchFromRouter = createSelector(
    (routerProps=null) => !routerProps.match ? null : routerProps.match,
  );

  const getRouteFromStore = createSelector(
    (store) => store.viewData.loc.route,
  );
  const getUrlFromStore = createSelector(
    (store) => store.viewData.loc.url,
  );
  const getParamsFromStore = createSelector(
    // params are stored directly in loc, not in a params object
    //   THIS FUNCITON MUST BE UPDATED IF store.viewData.loc DEFINITION changes!
    (store) => {
      const loc = store.viewData.loc;
      const locKeys = Object.keys(loc);
      const params = locKeys.reduce((acc, key, ) => {
        // 'match' is currently NOT used, or saved to store,
        //    but it is set up to do so, so include it in the list.
        if (['url', 'route', 'routeName', 'match'].find(key) === -1) {
          acc[key] = loc[key];
        }
        return acc;
      }, {});
      return params;
    }
  );
  const getMatchFromStore = createSelector(
    // I do NOT store "match" in store.
    // (could return url instead, but that might be confusing or contradict router Match)
    // routerProps not used, but must match this format
    (store) => {
        console.log('ERROR: viewData.getMatchFromStore store.viewData.loc does not have a "match" Property');
        return null;
    }
  );

  // params: (store, routerProps=null), or (null, routerProps) or (store)
  // if routerProps is passed in, loc is derived from routerProps,
  // else it returns loc info last saved to store
  const getRoute = createSelector(
    (store, routerProps) => {
      if (!store && !routerProps) {
        console.log('ERROR: viewData.getRoute is missing parameters: (store, routerProps)');
        return null
      }
      if (routerProps) {
        return getRouteFromRouter(routerProps)
      }
      return getRouteFromStore(store);
    }
  );

  const getUrl = createSelector(
    (store, routerProps) => {
      if (!store && !routerProps) {
        console.log('ERROR: viewData.getUrl is missing parameters: (store, routerProps)');
        return null
      }
      if (routerProps) {
        return getUrlFromRouter(routerProps)
      }
      else {
        return getUrlFromStore(store);
      }
    }
  );

  const getParams = createSelector(
    (store, routerProps) => {
      if (!store && !routerProps) {
        console.log('ERROR: viewData.getParams is missing parameters: (store, routerProps)');
        return null
      }
      if (routerProps) {
        return getParamsFromRouter(routerProps)
      }
      else {
        return getParamsFromStore(store);
      }
    }
  );

  const getMatch = createSelector(
    (store, routerProps) => {
      if (!store && !routerProps) {
        console.log('ERROR: viewData.getMatch is missing parameters: (store, routerProps)');
        return null
      }
      if (routerProps) {
        return getMatchFromRouter(routerProps)
      }
      else {
        return getMatchFromStore(store);
      }
    }
  );


  // routeName is the SAME as its key (by definition),
  const validRouteNames = Object.keys(ROUTES);

  const getSelectedRouteName = createSelector(
      //  Takes 2 params: store and routerProps.
        //  IF called as (null, routerProps), or (store, routerProps) - it **ignores** store
        //    it will use routerProps to get
        //    the currently MATCHED route (for *that component* - see below)
        //  If called as (store, null), or (store), it will use
        //    store.viewData.loc to get the matched route of the PAGE that was
        //    last saved to the store. (categories route does NOT save to the store)

        //  note: if called with routerProps, it will return
        //    the MATCHED Route for the COMPONENT which called it!
        //    ie, Categories, which renders on every page,
        //    MATCHES on '/', so this function will always return the "home"
        //    route when called FROM Categories.
        //    If want the BROWSER route - call it with routerProps=null
        //    This way, it'll return the value previous saved to store.
        //    Navigating to a new page requires cDM to call changeView,
        //    before the store will be asynch updated.
        //    Thus Categories (for example, since it *should* be calling this
        //      func with "store", *NOT* "routrProps")
        //    will call this function twice, once at page load,
        //    and once after store.viewData.loc updates to store the current Browser url.
        //    (reason this works is b/c Categories does NOT call changeView / update loc)

        //  If need this value on a "Page" component, call it with routerProps
        //    so the most current value can be returned immediately.

        getRoute,

        (route) => {
          const matchedRouteKey = validRouteNames.find((validRouteName) => {
            return ROUTES[validRouteName].route === route;
          });
          const selectedRouteName = ROUTES[matchedRouteKey].name || 'home';
          // (routeKey === routeName by definition) - so could use that as a shortcut
        return selectedRouteName;
      }
  );

  // must be called as (store, routerParams), (null, routerParams)
  export const  getLocFromRouter = createSelector(
    getUrlFromRouter,
    getParamsFromRouter,
    getRouteFromRouter,
    getMatchFromRouter,

    getSelectedRouteName,

    (url, params, route, match, selectedRouteName) => {
      const loc = {
        // actual location, not just the "match"ed part
        url: url,

        // got rid of params key, instead storing params directly on loc
        ...params,

        // note, this is the "matched" route - not necessarily the full route
        //  (for example: if accessed from within Categories component,
        //   route will ALWAYS be '/' because Categories renders/matches ALL routes)
        route,
        routeName: selectedRouteName,

        // I don't use match.url currently, it's ready if I decide it's needed
        // match: match.url,

      };
      console.log('viewData.getLoc, loc:', loc);
      return(loc);
    }
  );


// ACTION CREATORS

  export const changeView = (routerProps, prevRouterProps=null) => (dispatch) => {
      const loc = getLoc(routerProps);
      // console.log('viewData.changeView, loc:', loc);

      const prevLoc = prevRouterProps ? getLoc(prevRouterProps) : null;
      if (loc.url === (prevLoc && prevLoc.url)) {
        // url hasn't changed: don't update store
        return;
      }
      dispatch ({
        type: CHANGE_VIEW,
        loc,
      })
  }

  export const changeSort = (persistentSortBy='date') => ({
    // TODO: add SortBy field to (browser) url ??
    //   if so, then would need to push the new URL
    // TODO: either validate the param given,
    //       or use sortByMethods to populate Component
    type: SORT_BY,
    persistentSortBy,
  })

  // TODO: implement User selectable sort order
  // export const sortOrder = ({  }) => ({
  //   type: SORT_ORDER,
  //   sortOrder: 'DESCENDING'
  // })


// DATA, INITIAL, SAMPLE

  const initialState_ViewData = {
    loc: {
      url:  HOME.url,
      route:     ROUTES.home,
      routeName: ROUTES.home.routeName,

      // store params directly on loc
      ...ROUTES.home.params,  // home route has NO params (currently)

      // match: HOME.url,
      //  not currently used..
      //  Leaving definition here, so it's easily available if decide to implement
      //    it is the "matched portion of the route" as determined by <Route> and <Switch>
      //    not necessarily the same as the route in the url
      //  TODO: what its "default value should match be set to: home, null,,
    },

    // sort method: 'by votes' or 'by date'
    persistentSortBy:    DEFAULT_SORT_BY,
    persistentSortOrder: DEFAULT_SORT_ORDER,
  }

function viewData(state=initialState_ViewData, action){
  // console.log('entering reducer viewData, prevState', state);
  // console.log('entering reducer viewData, action:'  , action);
  switch (action.type) {
    case CHANGE_VIEW:
      // console.log('viewData state: ', state);
      // console.log("viewData-actionType _CHANGE_VIEW, action:", action);
      return  ({
                ...state,
                loc: action.loc,
              });
    case SORT_BY:
      return  ({
                ...state,
                // TODO: add sort method stored in url ??
                persistentSortBy: action.persistentSortBy,
              });
    default:
      return state;
  }
};

export default viewData

// Selectors

// See also related calculatedRouteUrlFromLoc Function near ROUTES definitions
//    and getComputedUrlFromLocParamsAndRouteName also near ROUTES definitions
// Essentially the same function as calculatedRouteUrlFromLoc.
//    (except that this is a selector).
//    Also it has been re-written using reduce instead of for-in
//    (re-written just to compare the two algorithms)

export const getDerivedRouteUrlFromLoc = createSelector(
  //  creates a would-be router url using the routeName from the loc (in store)
  //    and routeName from ROUTE definitions.
  //    Then it combines params from the url/loc in store, using the route definition
  //    to create the would-be path for that route.  See NOTE below.
  (store) => store.loc,

  (loc) => {
    const thisRoute  = ROUTES[loc.routeName]
    const params     = ROUTES[loc.routeName].params;
    let routeUrl = params.reduce((acc, param) => {
        return acc += loc[param] + '/';
      }, thisRoute.base);
    //  remove final trailing '/' (IF) added by params loop
    if (params !== []) {
      routeUrl = routeUrl.slice(0, -1);
    }
    return routeUrl;
  }
);

    // NOTE for getLoc:
      //  url uses location.pathname instead of match.path
      //
      //  if component "matches" on a non-exact route,
      //  match.path and match.params may NOT reflect the full path
      //  For example, Categories Component is rendered on every path
      //  So (inside Categories) ALWAYS: match.path === '/' match.params === ''
      //    even when browser route is
      //    '/:categories', path '/react', and params is 'categoryPath: react'
      //  SO.. use location.pathname for actual url
      //    BUT.. NOTE params would still be incorrect when inside Categories
      //    - would need to self-parse the url to get the params of the actual url.
      //    Fortunately, params are not CURRENTLY needed in components that
      //    display/match on multiple/non-exact routes
      //    (Categories is the only such component currently)
      //    This Note is for FYI TroubleShooting in case this ever changes.
