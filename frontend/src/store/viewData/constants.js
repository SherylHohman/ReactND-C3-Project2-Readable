import { ALL_POSTS_CATEGORY } from '../categories/constants';

// ACTION TYPES

export const CHANGE_VIEW = 'CHANGE_VIEW';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const SORT_BY = 'SORT_BY';
// TODO: export const SORT_ORDER = 'SORT_ORDER'; // Descending, Ascending


// CONSTANTS

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

  // const ALL_POSTS_CATEGORY= {name: '', path: ''};
  export const HOME  = {
    url:          '/', //  ROUTES['home'].route
    category:     ALL_POSTS_CATEGORY,
    categoryPath: ALL_POSTS_CATEGORY.path,
    routeName:    'home'  //  ROUTES['home'].name,
  }

  const ALL_POSTS_URL = HOME.url;
  export const DEFAULT_SORT_BY    = 'date';
  export const DEFAULT_SORT_ORDER = 'descending';


  // TODO: Move to a routes.js file
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

// ROUTE HELPERS

  // TODO: Move these to a routes.js file
  //       or helpers file (or selectors file, even though not selectors)

  // routeName is the SAME as its key (by definition),
  export const validRouteNames = Object.keys(ROUTES);

  export function findRouteNameOfRoute(route){
    const matchedRouteKey = validRouteNames.find((validRouteName) => {
      return ROUTES[validRouteName].route === route;
    });
    return ROUTES[matchedRouteKey].name || 'home';
    // TODO: default value for unmatched route: null, '', 'home', 'category'
    //  usually
    //  the matched (bad aka 404) route will be a /:category, (category route) or
    //  the url of a deleted post, /:categoryPath/:postId,  (post route)
  };

  // The following functions compute urls for given params and routeName ONLY
  //  based on the route definition in ROUTES for that routeName
  //  (each version of the function takes in that info from a different source)
  //  used to compute urls a mapped over component item should navigate to
  //  or to compare a Router url with a Data-Based url

  // See also related Selector Function in ./selectors

  // used to calculate a url to navigate to, based on params and routeName in loc
  //  loc supplies params AND routeName
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
  //  loc supplies the params ONLY,
  //  routeName supplies the route that want to nav to.
  export function computeUrlFromLocParamsAndRouteName(loc, routeName){
    if (!routeName) {routeName = loc.route || 'home';}
    let computedUrl = ROUTES[routeName].base;
    for (let param in ROUTES[routeName].params) {
      computedUrl += loc[param];
    }
    return computedUrl;
  }

  // used to calculate a url to navigate to, based on ROUTES definitions, where:
  //  routeName is a string, must match a ROUTES.name in ROUTES
  //  paramValues is an object of {paramName: paramId} objects
  //    examples:
  //    {postId: '6ni6ok3ym7mf1p33lnez'} or
  //    {categoryPath: 'react', postId: '6ni6ok3ym7mf1p33lnez'}
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
