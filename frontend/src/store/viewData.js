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
  // Special Case: when params list is {}, set its value to '' instead
  home:     {
    name :    'home',
    route:    '/',
    params:   [],  //[''],  //'',  // {},
    base:     '/',
    // param:    '' ,
  },
  category: {
    name :    'category',
    route:    '/:categoryPath',
    params :  ["categoryPath"],
    base:     '/',
    // param:    ':categoryPath',
  },
  post:     {
    name :    'post',
    route:    '/:categoryPath/:postId',
    params :  ["categoryPath", "postId"],
    base:     '/',  // TODO: not sure what makes sense for this value
    // param:    ':postId',
  },
  editPost: {
    name :    'editPost',
    route:    '/post/edit/:postId',
    params :  ["postId"],
    base:     '/post/edit/',
    // param:    ':postId',
  },
  newPost:  {
    name :    'newPost',
    route:    '/post/new/',
    params:   [],  //[''],  //'',  // {},
    base:     '/post/new/',
    // param:    '',
  },
  // undefinedRoute: {
  //   name :    'undefinedRoute',
  //   route:    '',
  //   params:   [],  //[''],  //'',  // {},
  //   base:     '',
  // }
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
  // console.log('viewData, computeUrlFromLocParamsAndRouteName, computedUrl:', computedUrl);
  return computedUrl;
}
// used to calculate a url to navigate to, based on routeName supplied by component
// paramValues eg: {postId: '6ni6ok3ym7mf1p33lnez'} or {categoryPath: 'react', postId: '6ni6ok3ym7mf1p33lnez'}
export function computeUrlFromParamsAndRouteName(paramValues, routeName='home'){
  let computedUrl = ROUTES[routeName].base;
  for (let param in ROUTES[routeName].params) {
    if (!paramValues[param]) {
      console.log('ERROR: viewData.computeUrlFromParamsAndRouteName, missing param:', param)
      computedUrl += ''
    }
    else {
      computedUrl += paramValues[param];
    }
  }
  // console.log('viewData, computeUrlFromLocParamsAndRouteName, computedUrl:', computedUrl);
  return computedUrl;
}

  //  "url" is an exact path, as per browser window
  //  (params, when exist are:) "categoryPath", "postId"
  //    ("categoryPath" is a url-safe string for the category url. Not including'/'')
  //  "route" is a route format, where `:` prefix represents a variable name
  //  "sortOrder" is "Ascending" or "Descending". Not implemented.

  // ensure consistancy
  // ALL_POSTS_CATEGORY compliments the "categories" defined on server,
  //  adds a "category" definition for the home page: posts for "All" Categories
  const ALL_POSTS_CATEGORY= {name: '', path: ''};
  const ALL_POSTS_ID  = '' ;
  const ALL_POSTS_URL = '/';
  export const DEFAULT_SORT_BY = 'date';
  export const DEFAULT_SORT_ORDER = 'high_to_low';

  export const HOME  = {
    // id: ALL_POSTS_ID,
    // replaced id with categoryPath
    categoryPath: ALL_POSTS_CATEGORY.path,
    url: ALL_POSTS_URL,
    category: ALL_POSTS_CATEGORY,
  }

  // 'store' or 'router'
  function getLocFrom(store, routerProps=null){
    let loc;
    if (routerProps){
      loc = getLoc(routerProps);
      // console.log('loc from routerProps', loc);
    }
    else {
      loc = store.viewData.loc;
      // console.log('loc from viewData', loc);
    }
    return loc;
  }

  export function getLoc(routerProps=null){
    // console.log('getLoc, routerProps:', routerProps);
    // console.log('getLoc, routerProps.location:', routerProps.location);
    // console.log('getLoc, routerProps.match:', routerProps.match);
    if (!routerProps){
      console.log('viewData.getLoc, invalid routerProps (prob checking for prevRouterProps)')
      // return null;
    }
    const match    = (routerProps && routerProps.match)    || null;
    const location = (routerProps && routerProps.location) || null;
    // console.log('viewData.getLoc, routerProps.location:', location);
    if (!match) {
      console.log('getLoc, no "match" object - possibly a child component that routeProps was not passed as props'); //return null;  //exit early
      // return null;
    }
    const params = !match ? {} : match.params
    const route = (match && match.path) || ROUTES.home.route;
    // console.log('viewData.getLoc, route:', route);

    const getRouteName = route => {
      // routeName is the same as its key, so can refactor using ke as a shortcut
      const routeKeys = Object.keys(ROUTES);
      const matchedRouteKey = routeKeys.find((key) => {
        return ROUTES[key].route === route;  //url
      });
      // TODO: default value for unmatched route: null, '', 'home' ??
      //  usually (unless there is another '/' in the (bad) url),
      //  the matched (bad) route will be /:category
      //  or it will be the url of a deleted post /:categoryPath/:poatId
      return ROUTES[matchedRouteKey].name || 'home' //null;
    };
    const routeName = getRouteName(route);
    // console.log('viewData.getLoc, routeName: ', routeName);
    // function getComputedRouteFromUrl(url){
    // }

    const loc = {
      // actual location, not just the "match"ed part
      url: location.pathname,

      // got rid of params key, instead storing params directly on loc
      // ...match.params,
      ...params,

      // note, this is the "matched" route - not necessarily the full route
      //  (for example: if accessed from within Categories component,
      //   route will ALWAYS be '/' because Categories renders/matches ALL routes)
      route,
      routeName,

      // I don't use match.url currently, it's ready if I decide it's needed
      // match: match.url,

    };
    console.log('viewData.getLoc, loc:', loc);
    return(loc);
  }

// ACTION CREATORS

  export const changeView = (routerProps, prevRouterProps=null) => (dispatch) => {
      const loc = getLoc(routerProps);
      // console.log('viewData.changeView, loc:', loc);

      const prevLoc = prevRouterProps ? getLoc(prevRouterProps) : null;
      if (loc.url === (prevLoc && prevLoc.url)) {
        // url hasn't changed: don't update store
        console.log('viewData.changeView, not updating store.loc..',
                    'prev url:', prevLoc.url,
                    'curr url:', loc.url
                   );
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

      // not currently used..
      //  Leaving definition here, so it's easily available if decide to implement
      //    it is the "matched portion of the route" as determined by <Route> and <Switch>
      //    not necessarily the same as the route in the url
      //  TODO: not what "default value for match should be set to: home, null,,
      // match: HOME.url,
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
  //  creates a would-be router url using the routeName from the loc in store
  //    to pull the "rule" defining that routeName from ROUTE definitions.
  //    then it combines params from the url/loc in store to create the
  //    would-be path for that route.  Note:
  (store) => store.loc,
  (loc) => {
    const thisRoute  = ROUTES[loc.routeName]
    const params     = ROUTES[loc.routeName].params;
    let routeUrl = params.reduce((acc, param) => {
        return acc += loc[param] + '/';
      }, thisRoute.base);
    //  remove extra trailing '/' ONLY IF added b/c have params
    if (params != []) {
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
      //    fortunately, params are not CURRENTLY needed in components that
      //    display/match on multiple/non-exact routes
      //    (Categories is the only such component currently)
      //    This Note is for FYI TroubleShooting in case this ever changes.
