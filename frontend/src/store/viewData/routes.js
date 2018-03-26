  // import ALL_POSTS_CATEGORY from '../categories/constants';
  import { ALL_POSTS_CATEGORY }  from './constants';
  import { HOME, ALL_POSTS_URL } from './constants';

  //
    // export const ALL_POSTS_CATEGORY= {name: '', path: ''};
    // const ALL_POSTS_URL = HOME.url;

    // export const HOME  = {
    //   url: '/',
    //   category:     ALL_POSTS_CATEGORY,
    //   categoryPath: ALL_POSTS_CATEGORY.path,
    //   //routeName = 'home' OR routeName='category'
    // }

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

// ROUTE HELPERS / kind of like selectors/reducers for (react) Router and ROUTES

  // routeName is the SAME as its key (by definition),
  export const validRouteNames = Object.keys(ROUTES);

  // See also related Selector Function
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
  // used to calculate a url to navigate to,
    //  based on ROUTES definitions, where
    //  routeName, and params, values are both supplied by the component
    // paramValues eg:
    //  {postId: '6ni6ok3ym7mf1p33lnez'} or
    //  {categoryPath: 'react', postId: '6ni6ok3ym7mf1p33lnez'}
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

  // export function computeRouteNameFromUrl(url, routes){
    //   // parses url into parts
    //   // see if that combination of parts matches any defined route in ROUTES
    //   // if so, reverse-lookup that route to the routeName
    //   // return the routeName
    // }
