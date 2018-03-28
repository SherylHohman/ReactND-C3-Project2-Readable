import { createSelector } from 'reselect';
import { ROUTES, validRouteNames } from './constants';


// SELECTORS

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

    const getRouteName = route => {
      const routeKeys = Object.keys(ROUTES);    // ROUTE[name].name doubles as the key
      const matchedRouteKey = routeKeys.find((key) => {
        return ROUTES[key].route === route;
      });
      // TODO: default value for unmatched route: null, '', 'home' ??
      //  (unless there is another '/' in the (bad) url), usually
      //  the matched (bad) route will be a /:category, (category route) or
      //  the url of a deleted post, /:categoryPath/:postId
      return ROUTES[matchedRouteKey].name || 'home';
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
      //   route will ALWAYS be '/' because Categories
      //   renders ("matches" on) on ALL routes
      route,
      routeName,

      // not used currently.  This is the part of the url that the calling
      //  component uses to decide it should render.  It is NOT necessarily
      //  the full url.  For example, Categories renders on all pages, so it
      //  will always have '/', even when the actual url is another page.

      // match: match.url,

    };
    return(loc);
  }

  // if provided, uses routerProps to calculate,
  // else returns value saved in store
  // (if using routerProps, can pass in "null" instead of "store" as first argument)
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


  const getRouteFromRouter = createSelector(
    (routerProps) => (routerProps.match && routerProps.match.path) || ROUTES.home.route
  );
  const getUrlFromRouter = createSelector(
    (routerProps) => (routerProps && routerProps.location.pathname) || null
  );
  const getParamsFromRouter = createSelector(
    (routerProps) => !routerProps.match ? {} : routerProps.match.params,
  );
  const getMatchFromRouter = createSelector(
    (routerProps) => !routerProps.match ? null : routerProps.match,
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
  const getMatchFromStore = createSelector(
    // I do NOT store "match" in store.
    // (could return url instead, but that might be confusing or contradict router Match)
    // routerProps not used, but must match this format
    (store) => {
        console.log('ERROR: viewData.getMatchFromStore store.viewData.loc does not have a "match" Property');
        return null;
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
      //  remove final trailing '/' (IF) added by params loop
      if (params !== []) {
        routeUrl = routeUrl.slice(0, -1);
      }
      return routeUrl;
    }
    // See also related calculatedRouteUrlFromLoc Function near ROUTES definitions
    //    and getComputedUrlFromLocParamsAndRouteName also near ROUTES definitions
    // Essentially the same function as calculatedRouteUrlFromLoc.
    //    (except that this is a selector).
    //    Also it has been re-written using reduce instead of for-in
    //    (re-written just to compare the two algorithms)

    // if passed in with routerProps, uses routerProps, else uses store
    // params: (store, routerProps=null)
  );

  const getSelectedRouteName = createSelector(
        getRoute,

        (route) => {
          const matchedRouteKey = validRouteNames.find((validRouteName) => {
            return ROUTES[validRouteName].route === route;  //url
          });
          const selectedRouteName = ROUTES[matchedRouteKey].name || 'home' //null;
        return selectedRouteName;
      }
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
        //  route will ALWAYS be '/' because Categories renders/matches ALL routes)
        route,
        routeName: selectedRouteName,

        // I don't use match.url currently, it's ready if I decide it's needed
        // match: match.url,

      };
      console.log('viewData.getLoc, loc:', loc);
      return(loc);
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
