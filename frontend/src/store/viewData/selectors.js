import { createSelector } from 'reselect';
import { ROUTES, validRouteNames, findRouteNameOfRoute } from './constants';

// SELECTORS PERSISTENT (ie non LOC items)

  // export const getSortBy    = store.viewData.persistentSortBy;
  // export const getSortOrder = store.viewData.persistentSortOrder;

  // creating selectors here, because considering changing state format.
  //  This way I won't need update my Posts component to pass (store) when I do.
  export const getSortBy = createSelector(
      (store) => store.viewData.persistentSortBy,
      (sortBy) => { return sortBy }
  );
  export const getSortOrder = createSelector(
      (store) => store.viewData.persistentSortOrder,
      (sortOrder) => { return sortOrder }
  );

// SELECTORS LOC (from Store or from RouterProps)

  const getRouteFromRouter = createSelector(
    (routerProps) => (routerProps.match && routerProps.match.path) || ROUTES.home.route
  );
  const getUrlFromRouter = createSelector(
    (routerProps) => (routerProps && routerProps.location.pathname) || null
  );
  const getParamsFromRouter = createSelector(
    (routerProps) => !routerProps.match ? {} : routerProps.match.params,
  );

  const getRouteFromStore = createSelector(
    (store) => store.viewData.loc.route,
  );
  const getUrlFromStore = createSelector(
    (store) => store.viewData.loc.url,
  );
  const getParamsFromStore = createSelector(
    // params are stored directly in loc, not in a params object
    // THIS FUNCTION MUST BE UPDATED IF loc changes!
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

  // if passed in with routerProps, uses routerProps, else uses store
  // params: (store, routerProps=null)
  const getRoute = createSelector(
    (store, routerProps) => {
      if (!store && !routerProps) {
        console.log('ERROR: viewData.getRoute is missing parameters: (store, routerProps)');
        return null
      }
      if (routerProps) {
        return getRouteFromRouter(routerProps)
      }
      return   getRouteFromStore(store);
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

  // must be called as (store, routerParams), (null, routerParams)
  // must be called as (routerParams)
  export const  getLocFromRouter = createSelector(
    getUrlFromRouter,
    getParamsFromRouter,
    getRouteFromRouter,

    (url, params, route) => {
      const loc = {
        // actual location, not just the "match"ed part
        url: url,

        // got rid of params key, instead storing params directly on loc
        ...params,

        // note, routerProps (Router or BrowserRouter) just gives us the
        //   "matched" route - which is not necessarily the full Browser route
        //  (for example: if called from within Categories component,
        //  "route" from routerProps will ALWAYS be '/'
        //  because Categories renders/matches on ALL routes)
        route,
        routeName: findRouteNameOfRoute(route),

      };
      console.log('viewData.getLoc, loc:', loc);
      return(loc);
    }
  );

  export function getLocFromStore(store) {
    return store.viewData.loc;
  }

  //  (routerProps is not store, but is like store in that it is the source of truth for Urls.)
    //  viewData.loc simply saves (essential info from) routerProps to store
    //  * after-the-fact *
    //  routerProps is very related to viewData.loc, and a precursor to its store

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
    const route  = (match && match.path) || ROUTES.home.route;

    const routeName = findRouteNameOfRoute(route);

    const loc = {
      // actual location, not just the "match"ed part
      url: location.pathname,

      // got rid of params key, instead storing params directly on loc
      // ...match.params,
      ...params,

      // note, this is the "matched" route of the calling componentas per its routerProps
      //   - not necessarily the route for the PAGE in the BROWSER BAR
      //   (for example: if called from within Categories component,
      //   route will ALWAYS be '/' because Categories
      //   renders ("matches" on) on ALL routes, and that is how Router / BrowserRouter works
      route,
      routeName,
    };

    return(loc);
  }

  // if provided, uses routerProps to calculate,
  //    (in this case, can pass in "null" instead of "store" as first argument)
  // else returns value saved in store
  //    (in this case, routerProps need not be passed in)
  export function getLocFrom(store, routerProps=null){
    let loc;
    if (routerProps){
      loc = getLoc(routerProps);
      console.log('loc from routerProps', loc);
    }
    else {
      if (!store) {
        console.log('ERROR: viewData.getLocFrom, ',
                    'REQUIRES: "(store)" argument, or "(null, routerProps)" as arguments'
                    );
        return null
      };

        loc = getLocFromStore(store);
      console.log('loc from viewData', loc);
    }
    return loc;
  }


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
