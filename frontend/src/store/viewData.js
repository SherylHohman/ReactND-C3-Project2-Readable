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

  // TODO: get paths from App.js, then use to populate App.js
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
    route:    'post/edit/:postId',
    params :  [],
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
export function getComputedUrlFromLocParamsAndRouteName(loc, routeName){
  if (!routeName) {routeName = loc.route || 'home';}
  let computedUrl = ROUTES[routeName].base;
  for (let param in ROUTES[routeName].params) {
    computedUrl += loc[param];
  }
  // console.log('viewData, computeUrlFromLocParamsAndRouteName, computedUrl:', computedUrl);
  return computedUrl;
}

  // "id" is one of: post.id, comment.id, category.name
  // "url" is an exact path, as per browser window
  // "route" is a route format, where `:` prefix represents a variable name
  // "sortOrder" is "Ascending" or "Descending". Not implemented.
  // "category.path" is a url-safe string for the category url. Not including'/''

  // ensure consistancy
  const ALL_POSTS_CATEGORY= {name: '', path: ''};
  const ALL_POSTS_ID  = '' ;
  const ALL_POSTS_URL = '/';
  export const DEFAULT_SORT_BY = 'date';
  export const DEFAULT_SORT_ORDER = 'high_to_low';

  export const HOME  = {
    id: ALL_POSTS_ID,
    url: ALL_POSTS_URL,
    category: ALL_POSTS_CATEGORY,
  }

  export function getLoc(routerProps=null){
    // console.log('getLoc, routerProps:', routerProps);
    // console.log('getLoc, routerProps.location:', routerProps.location);
    // console.log('getLoc, routerProps.match:', routerProps.match);
    const match    = (routerProps && routerProps.match)    || null;
    const location = (routerProps && routerProps.location) || null;
    // console.log('viewData.getLoc, routerProps.location:', location);
    if (!match) {
      // console.log('getLoc, no "match" object - possibly a child component that routeProps was not passed as props'); //return null;  //exit early
      // return null;
    }
    const route = (match && match.path) || ROUTES.home.route;
    // console.log('viewData.getLoc, route:', route);

    const getRouteName = url => {
      // routeName is the same as its key, so can refactor using ke as a shortcut
      const routeKeys = Object.keys(ROUTES);
      const matchedRouteKey = routeKeys.find((key) => {
        // console.log('---- viewData.getLoc.getRouteName',
        //             '\nkey ', key,
        //             '\nkey.route ', ROUTES[key].route,
        //             '\nroute ', route,
        //             '\nIS ROUTE? ', ROUTES[key].route === route
        //             );
        return ROUTES[key].route === route;  //url
      });
      // console.log('viewData.getLoc.getRouteName',
      //             '\nmatchedRouteKey:', matchedRouteKey,
                  // '\nrouteName: ', ROUTES[matchedRouteKey].name
                  // );

      // TODO: default value for unmatchec route: null, '', 'home' ??
      //  usually, it /:category will match bad urls, unless there is another '/'
      return ROUTES[matchedRouteKey].name || 'home' //null;
    }
    const routeName = getRouteName(route);
    // console.log('viewData.getLoc, routeName: ', routeName);

    // function getComputedRouteFromUrl(url){

    // }

    // console.log('__let loc.params = match.params:', match.params);
    const loc = {
      // actual location, not just the "match"ed part
      url: location.pathname, // null,

      // TODO: get rid of params, key, just store params in directly
      params: match.params, // || null, //'', //null,
      ...match.params,

      // note, this is the "matched" route - not necessarily the full route
      //  (for example: called from in Categories component,
      //   this will always be '/' because it always renders)
      route,
      routeName,

      // I don't use match.url currently, it's ready if I decide it's needed
      // match: match.url,

      // NOTE: if component "matches" on a non-exact route,
      //  match.path and match.params may NOT reflect the full path
      //  For example, Categories is rendered on every path
      //  So ALWAYS match.path === '/' match.params === ''
      //    even on route '/:categories', path '/react', and params 'categoryPath: react'
      //  SO.. use location.pathname for actual url
      //    BUT.. would need to self-parse to get the params of the actual url.

    };
    // console.log('viewData.getLoc, loc:', loc);
    return(loc);
  }

// ACTION CREATORS

//   export const changeView = (newViewData=HOME) => (dispatch) => {
//       // console.log('__++__entering viewData.CHANGEVIEW, newViewData:', newViewData);
//       const loc = newViewData.loc;
//       // console.log('__++__entering viewData.changeView, loc:', loc);
//       dispatch ({
//         type: CHANGE_VIEW,
//         loc,
//       })
// }
  export const changeView = (routerProps, prevRouterProps=null) => (dispatch) => {
      const loc = getLoc(routerProps);
      // console.log('__++__entering viewData.changeView, loc:', loc);
      // console.log('__++__entering viewData.CHANGEVIEW, newViewData:', newViewData);
      if (prevRouterProps && (getLoc(prevRouterProps).url === loc.url)) {
        // url hasn't changed: don't update store
        // console.log('changeView, ',
        //             'prev url:', getLoc(prevRouterProps).url,
        //             'curr url:', loc.url
        //            );
        return;
      }
      dispatch ({
        type: CHANGE_VIEW,
        loc,
      })
  }

  export const changeSort = (persistentSortBy='date') => ({
    // TODO: add this field to (browser) url ??
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
    // currentUrl:   HOME.url,
    // categoryPath: HOME.categoryPath,
    // postId: null,
    loc: {
      url: HOME.url,
      route: ROUTES.home,
      routeName: ROUTES.home.routeName,
      // TODO: get rid of params, key, just store params in directly
      params: ROUTES.home.params,
      // TODO: not sure how to handle empty params: '', null, [], ??
      ...ROUTES.home.params,
      // not currently used..
      //  it is the "matched portion of the route" as determined by <Route> and <Switch>
      //  not necessarily the same as the route in the url
      // TODO: not what "default value for match should be set to: home, null,, ..
      match: HOME.url,
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
      // console.log("_++_CHANGE_VIEW, action:", action);
      return  ({
                ...state,
                loc: action.loc,
              });
    case SORT_BY:
      // console.log('SORT_BY, action:', action);
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
