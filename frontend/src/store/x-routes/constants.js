// // ACTION TYPES
export const NAVIGATED_TO_NEW_PAGE = 'NAVIGATED_TO_NEW_PAGE';
// export const CHANGE_VIEW = 'CHANGE_VIEW';

// CONSTANTS

  // For consistancy,
  // Add a "category" definition for the home page: posts for "All" Categories
  // ALL_POSTS_CATEGORY compliments the "categories" defined on server,
  // could be: {name: 'All', path:''} // name is the display name for the category
  const ALL_POSTS_CATEGORY= {name: '', path: ''};
  // TODO: move this to categories.js

  const ALL_POSTS_URL = '/';

  export const HOME  = {
    url: ALL_POSTS_URL,
    category: ALL_POSTS_CATEGORY,
    categoryPath: ALL_POSTS_CATEGORY.path,
    //routeName = 'home' OR routeName='category'
  }

// ROUTES

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

  // routeName is the SAME as its key (by definition),
  const validRouteNames = Object.keys(ROUTES);

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

