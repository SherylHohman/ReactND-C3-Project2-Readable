import { createSelector } from 'reselect';
import { ROUTES, validRouteNames } from './routes';  // './constants';

// SELECTORS

  export const routerPropsIsExactMatch = (routerProps) => routerProps.match.isExact;


  const getRouteFromRouter = createSelector(
    // Note: portion of the route that triggered the calling component to render
    (routerProps) => (routerProps.match && routerProps.match.path) || ROUTES.home.route,
    (route) => route
  );
  const getUrlFromRouter = createSelector(
    (routerProps) => {
      console.log('---viewData.selectors.getUrlFromRouter, routerProps:', routerProps)
      return (routerProps && routerProps.location.pathname) || null
    },
    (url) => url
  );
  const getParamsFromRouter = createSelector(
    // Note: params from portion of the route that triggered the calling component to render
    (routerProps) => !routerProps.match ? {} : routerProps.match.params,
    (params) => params
  );
  // not implemented
    // const getMatchFromRouter = createSelector(
    //   (routerProps) => !routerProps.match ? null : routerProps.match,
    // );

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
  // not implemented
    // const getMatchFromStore = createSelector(
    //   // I do NOT store "match" in store.
    //   // (could return url instead, but that might be confusing or contradict router Match)
    //   // routerProps not used, but must match this format
    //   (store) => {
    //       console.log('ERROR: viewData.getMatchFromStore store.viewData.loc does not have a "match" Property');
    //       return null;
    //   }
    // );

  // if passed in with routerProps, uses routerProps, else uses store
  // params: (store, routerProps=null)
  const getRoute = createSelector(
    (store, routerProps) => {
      if (!store && !routerProps) {
        console.log('ERROR: viewData.getRoute is missing parameters: (store, routerProps)',
                    '\nstore:', store, '\nrouterProps:', routerProps);
        return null
      }
      if (routerProps) {
        console.log('viewData.getRoute is calling getRouteFromRouter with',
                    '\nstore:', store, '\nrouterProps:', routerProps);
        return getRouteFromRouter(routerProps)
      }
        console.log('viewData.getRoute is calling getRouteFromStore with',
                    '\nstore:', store, '\nrouterProps:', routerProps);
      return   getRouteFromStore(store);
    }
  );

  // params: (store, routerProps=null)
  export const getUrl = createSelector(
    (store, routerProps) => {
      if (!store && !routerProps) {
        console.log('ERROR: viewData.getUrl is missing parameters. \nstore:', store,
                    '\nrouterProps:', routerProps);
        return null
      }
      if (routerProps) {
        console.log('viewData.getUrl routerProps:', routerProps)
        return getUrlFromRouter(routerProps)
      }
      else {
        console.log('viewData.getUrl store:', store)
        return getUrlFromStore(store);
      }
    }
  );

  // params: (store, routerProps=null)
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

  // // not implemented
    // // if passed in with routerProps, uses routerProps, else uses store
    // // params: (store, routerProps=null)
    // const getMatch = createSelector(
    //   (store, routerProps) => {
    //     if (!store && !routerProps) {
    //       console.log('ERROR: viewData.getMatch is missing parameters: (store, routerProps)');
    //       return null
    //     }
    //     if (routerProps) {
    //       return getMatchFromRouter(routerProps)
    //     }
    //     else {
    //       return getMatchFromStore(store);
    //     }
    //   }
    // );


  //  called as (store)
  export const getDerivedRouteUrlFromLoc = createSelector(
    //  creates a would-be router url using the routeName from the loc in store
    //    to pull the "rule" defining that routeName from ROUTE definitions.
    //    then it combines params from the url/loc in store to create the
    //    would-be path for that route.  Note:
    (store) => store.loc,
    (loc) => {
      const routeObject = ROUTES[loc.routeName]
      const paramsArray = ROUTES[loc.routeName].params;
      let routeUrl = paramsArray.reduce((acc, paramName) => {
          return acc += loc[paramName] + '/';
        }, routeObject.base);
      //  remove final trailing '/' (IF) added by params loop
      if (paramsArray !== []) {
        routeUrl = routeUrl.slice(0, -1);
      }
      console.log('viewData.selectors getDerivedRouteUrlFromLoc', routeUrl);
      return routeUrl;
    }
    //  Essentially the same as calculatedRouteUrlFromLoc (in ./routes).
    //  (except that this is a selector).
  );

  // usually called as (loc), But only requires: ({ routeNameObj, ...paramObjs })
  //  ie {routeName: 'post', categorName: 'redux', postId: 'xyz'}
  export const getDerivedRouteUrl = createSelector(
    // reverse creates the url given a routeName and params supplied by the (loc) object
    // routeName is used to lookup the route definition and "base" from ROUTES.
    // then it uses that as a template to crease a route url from the params (and base)
    // This can later be compared with the path of a browser url to see if it is an exact match
    (loc) => {
      const routeObject = ROUTES[loc.routeName]
      const paramsArray = ROUTES[loc.routeName].params;
      let routeUrl = paramsArray.reduce((acc, paramName) => {
          return acc += loc[paramName] + '/';
        }, routeObject.base);
      //  remove final trailing '/' - from the params loop
      if (paramsArray !== []) {
        routeUrl = routeUrl.slice(0, -1);
      }
      console.log('viewData.selectors getDerivedRouteUrl', routeUrl);
      return routeUrl;
    }
  );

  // // usually called as (loc), But only requires: ({ routeNameObj, ...paramObjs })
    // //  ie {routeName: 'post', categorName: 'redux', postId: 'xyz'}
  // export const deriveRouteUrl = (loc) => {
    //   //  creates a would-be router url from params in the loc object.
    //   //    It uses the routeName to lookup the required ROUTE definition.
    //   //    Then combines params on the loc object to create a path for that route.
    //   //    This can later be compared with the path of a browser url.
    //     const routeObject = ROUTES[loc.routeName]
    //     const paramsArray = ROUTES[loc.routeName].params;
    //     let routeUrl = paramsArray.reduce((acc, paramName) => {
    //         return acc += loc[paramName] + '/';
    //       }, routeObject.base);
    //     //  remove final trailing '/' (IF) added by params loop
    //     if (params !== []) {
    //       routeUrl = routeUrl.slice(0, -1);
    //     }
    //     return routeUrl;
    //   }

  const getCurrentRouteNameFromRouter = createSelector(
        (routerProps) => {
          // console.log('viewData.selectors getSelectedRouteNameFromRouter \nrouterProps', routerProps)
          const route = getRouteFromRouter(routerProps);
          return route;
        },

        (route) => {
          console.log('viewData.selectors getSelectedRouteNameFromRouter, route', route)
          console.log('viewData.selectors getSelectedRouteNameFromRouter, \nvalidRouteNames:', validRouteNames)
          let matchedRouteKey = validRouteNames.find((validRouteName) => {
            return ROUTES[validRouteName].route === route;
          });
          // find 'returns 'undefined' if not found
          // if (!matchedRouteKey) {matchedRouteKey = 'home'}
          if (!matchedRouteKey) { return null; }
          const selectedRouteName = ROUTES[matchedRouteKey].name; // || 'home' //null;
          console.log('viewData.selectors getSelectedRouteNameFromRouter, selectedRouteName', selectedRouteName)
        return selectedRouteName;
      }
    );

  const getSelectedRouteNameFromRouter = createSelector(
        (routerProps) => {
          console.log('viewData.selectors getSelectedRouteNameFromRouter \nrouterProps', routerProps)
          const route = getRouteFromRouter(routerProps);
          return route;
        },

        (route) => {
          console.log('viewData.selectors getSelectedRouteNameFromRouter, route', route)
          console.log('viewData.selectors getSelectedRouteNameFromRouter, \nvalidRouteNames:', validRouteNames)
          let matchedRouteKey = validRouteNames.find((validRouteName) => {
            return ROUTES[validRouteName].route === route;
          });
          // find 'returns 'undefined' if not found
          // if (!matchedRouteKey) {matchedRouteKey = 'home'}
          if (!matchedRouteKey) { return null; }
          const selectedRouteName = ROUTES[matchedRouteKey].name; // || 'home' //null;
          console.log('viewData.selectors getSelectedRouteNameFromRouter, selectedRouteName', selectedRouteName)
        return selectedRouteName;
      }
    );

  // takes: (store) or (null, routerProps) or (store=null, routerProps=null)
  // if called with 1 parameter,  it calls getRouteFromStore(store)
  // if called with 2 parameters, it calls getRouteFromRouter(routerProps)
  const getSelectedRouteNameFromStore = createSelector(
        (store) => {
          console.log('viewData.selectors getSelectedRouteName, \nstore:', store);
          const route = getRoute(store);
          return route;
        },
        (route) => {
          console.log('viewData.selectors getSelectedRouteName, route', route);
          let matchedRouteKey = validRouteNames.find((validRouteName) => {
            return ROUTES[validRouteName].route === route;
          });
          // find 'returns 'undefined' if not found
          // if (!matchedRouteKey) {matchedRouteKey = 'home'}
          if (!matchedRouteKey) { return null; }
          const selectedRouteName = ROUTES[matchedRouteKey].name; // || 'home' //null;
          console.log('viewData.selectors getSelectedRouteName, selectedRouteName', selectedRouteName);
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

// TODO: MAKE CHANGE_VIEW FOOL PROOF BY ONLY SAVING LOC TO STORE *IF*
  //   MATCH IS EXACT !!  Then no matter what component calls it,
  //    it can only save FULL URL (Page info) to the store.
  //  THEN, the only thing to do is ENSURE that ALL Components (or at least)
  //  (all Page Components) ACTUALLY call CHANGE_VIEW
  //  One Thing I *COULD DO* (even if not traditionally considered ok)
  //  Is call CHANGE_VIEW anytime getLoc is called with routerProps match isExact.
  //  And IF RouterProps has changed since the last getLoc call, AND it's isExact
  //  .. then auto call CHANGE_VIEW with the new info.

// // ----- REPLACED WITH getLocFromRouter FUNCTION BELOW --------------
  // export function getLoc(routerProps=null){
  //   if (!routerProps){
  //     console.log('possible Error: viewData.getLoc, invalid routerProps (prob checking for prevRouterProps)')
  //     // return null;
  //   }
  //   const match    = (routerProps && routerProps.match)    || null;
  //   const location = (routerProps && routerProps.location) || null;
  //   if (!match) {
  //     console.log('ERROR: getLoc, no "match" object - possibly a child component that routeProps was not passed as props'); //return null;  //exit early
  //     // return null;
  //   }
  //   const params = !match ? {} : match.params
  //   const route  = (match && match.path) || ROUTES.home.route;

  //   const getRouteName = route => {
  //     const routeKeys = Object.keys(ROUTES);    // ROUTE[name].name doubles as the key
  //     const matchedRouteKey = routeKeys.find((key) => {
  //       return ROUTES[key].route === route;
  //     });
  //     // TODO: default value for unmatched route: null, '', 'home' ??
  //     //  (unless there is another '/' in the (bad) url), usually
  //     //  the matched (bad) route will be a /:category, (category route) or
  //     //  the url of a deleted post, /:categoryPath/:postId
  //     return ROUTES[matchedRouteKey].name || 'home';
  //   };
  //   const routeName = getRouteName(route);

  //   const loc = {
  //     // actual location, not just the "match"ed part
  //     url: location.pathname,

  //     // got rid of params key, instead storing params directly on loc
  //     // ...match.params,
  //     ...params,

  //     // note, this is the "matched" route of the calling component
  //     //   - not necessarily the route for the PAGE in the BROWSER BAR
  //     //   (for example: if called from within Categories component,
  //     //   route will ALWAYS be '/' because Categories
  //     //   renders ("matches" on) on ALL routes
  //     route,
  //     routeName,

  //     // not used currently.  This is the part of the url that the calling
  //     //  component uses to decide it should render.  It is NOT necessarily
  //     //  the full url.  For example, Categories renders on all pages, so it
  //     //  will always have '/', even when the actual url is another page.

  //     // match: match.url,

  //   };
  //   return(loc);
  // }
  // // ---------------------------------------------------------


  // ----- REPLACED WITH GETLOC2 FUNCTION BELOW --------------
  // // if provided, uses routerProps to calculate,
  // // else returns value saved in store
  // // (if using routerProps, can pass in "null" instead of "store" as first argument)
  // export function getLocFrom(store, routerProps=null){
  //   let loc;
  //   if (routerProps){
  //     loc = getLoc(routerProps);
  //     // console.log('loc from routerProps', loc);
  //   }
  //   else {
  //     if (!store) {
  //       console.log('ERROR: viewData.getLocFrom, ',
  //                   'REQUIRES: "(store)" argument, or "(null, routerProps)" as arguments'
  //                   );
  //       return null
  //     };

  //     loc = store.viewData.loc;
  //     // console.log('loc from viewData', loc);
  //   }
  //   return loc;
  // }
  // ---------------------------------------------------------

  // NOTE that getLocFromRouter will always set params to the MATCHED part of the
    //   full route when route is NOT EXACT.
    // SO.. if want info on the BrowserUrl, use
    //  - getLocFromStore(store) (always fetches from store, which *should* have PAGE url)
    //  - getLoc. The latter
  // must be called as (routerParams)
  export const  getLocFromRouter = createSelector(
    getUrlFromRouter,
    getParamsFromRouter,
    getRouteFromRouter,
    // getMatchFromRouter,
    getCurrentRouteNameFromRouter,
    // getSelectedRouteNameFromRouter,

    // (url, params, route, match, selectedRouteName) => {
    // (url, params, route, selectedRouteName) => {
    (url, params, route, routeName) => {
      const loc = {
        // MUST update viewData.reducers.getParamsFromStore if loc definition changes

        // actual location, not just the "match"ed part
        url: url,

        // got rid of params key, instead storing params directly on loc
        ...params,

        // note, this is the "matched" route - not necessarily the full route
        //  (for example: if called from within Categories component,
        //  route will ALWAYS be '/' because Categories renders/matches ALL routes)
        route,
        routeName: routeName, // of the route above
        // routeName: selectedRouteName, // of the route above

        // I don't use match.url currently, it's ready if I decide it's needed
        // match: match.url,

      };
      console.log('viewData.getLoc, loc:', loc);
      return(loc);
    }
  );

export const getLocFromStore = createSelector(
  // STORE *SHOULD* only be updated when a new PAGE is loaded.
  //  ie after a component matching an EXACT Route calls CHANGE_VIEW from cDM
  //  (Only Page Components *should* be calling CHANGE_VIEW)
  //  But this depends on proper programming, so it *can* break
  (store) => {
    if (!store)  {
      console.log('Error: viewData/selectors.getLocFromStore, was passed an invalid store:\n', store);
      return null;
    }
    return store.viewData.loc;
  }
);

// NOTE: BREAKING CHANGES TO THS FUNCTION
//  Prior version is now called getLocFromRouter (routerProps)

// //  THIS version of getLoc takes 2 params: (store=null, routerProps=null)
// export const getLoc = createSelector(
//   // only interested in location info for PAGES (EXACT Router matches
//   // if component calling this function renders on EXACT path, then use routerProps
//   //   (so can get most up to date info, without waiting for CHANGE_VIEW to update the store
//   //    with the new PAGE url)
//   // otherwise, return location info from store.
//   // STORE *SHOULD* only be updated when a component matching an EXACT Route mounts.
//   // But this depends on proper programming, so it *can* break

//   // On the otherhand, if *do* want location info from a MATCHED but NOT EXACT path,
//   //    then call getLocFromRouter directly !
//   // This is a convenience function that always accepts store and routerProps
//   //   then returns the latest known PAGE loc info, without the user having to
//   //   think about whether the component matches on a partial or full route.

//   // (store, null) => store,
//   (store, routerProps=null) => {
//     console.log('viewData.getLoc \nstore:', store, '\nrouterProps:', routerProps)
//     console.log('getLoc, routerProps, routerPropsIsExactMatch', routerProps, routerPropsIsExactMatch(routerProps));
//     return  (!routerProps || !routerPropsIsExactMatch(routerProps))
//               ? null
//               : routerProps  // routerProps
//             },
//   // (store=null, routerProps=null) => (!store ? null : store),

//   (store, routerProps) => {
//     // if (!routerProps) {console.log('no routerProps', routerProps); return null;}
//     if (routerProps) return getLocFromRouter(routerProps);
//     if (store)   return getLocFromStore (store);
//     console.log('Error: viewData/selectors.xxx, missing store, and routerProps for this component is NOT and Exact Match');
//     return null;
//   }
// );

 // THIS version of getLoc takes 2 params:
 // call as(store=null, routerProps=null)
export function getLoc(store, routerProps){
    console.log('viewData.getLoc \nstore:', store, '\nrouterProps:', routerProps)
    if (routerProps && routerPropsIsExactMatch(routerProps)) {
    // if (routerProps) {
      return getLocFromRouter(routerProps);
    }
    if (store) {
      return getLocFromStore (store);
    }
    console.log('Error: viewData/selectors.xxx, missing store, and routerProps for this component is NOT and Exact Match');
    return null;
};


// -----------------------------------------

// NOTES - READ ME - "HYBRID STORE"
//    store vs routerProps (faux store) - and how these SELECTORS Work

  //  (routerProps is not store, but is like store in that it is the source of truth for Urls.)
    //  store.viewData.loc simply saves (essential info from)
    //  routerProps to store * after-the-fact *
    //  routerProps is very related to viewData.loc, and a precursor to its store

  //  The most general Selectors take 2 paramaters: (store=null, routerProps=null)
    //  and decide whether to return data from the actual store, or faux store (routerProps)
    //  The main differences between the data returned from routerProps vs store are:
    //  - routerProps returns data based on the MATCHED portion of the Browser URL
    //    This means that it uses only the portion of the URL/Route that the
    //    prompted the calling component to mount/render.  So all properties in loc
    //    (except the url itself) will be computed USING ONLY THIS "MATCHED" PART of
    //    the url that's currently shown in the browser bar.
    //  - routerProps is also the MOST UP TO DATE source of truth for the
    //    url (or matched portion of the url).
    //  - (loc savedin store is asynch) as depends on a componentDidMount to overtly
    //    make a call to changeView (CHANGE_VIEW) to save the "new" routerProps data
    //    to store.
    //    *CHANGE_VIEW Should Only Be Called for isEXACT *FULL PAGE* Components*
    //    for the app to respond as intended.
    //    This way, ONLY Browser Bar (routerProps data) is saved to the STORE
    //    Ensuring that every COMPONENT has direct access to
    //    route, routeName, match, and params (and url) FOR THE URL IN THE BROWSER BAR !
    //    (Rem routerProps for any component only has info for only the
    //      MATCHED portion of the url, which triggered its render)
    //    It's just the way Route/Router/Switch (react-router) works.
    //    I'm hijacking react-router's props (consolidated as "routerProps") for my own purposes.
    //  - When called from a component that renders on a FULL PAGE isEXACT URL,
    //    the difference between the two amounts to a performance boost on initial
    //    render.  Since componentDidMount must call CHANGE_VIEW to update the store,
    //    and that update is asynch, using routerProps rather than loc can save a
    //    fetch and render cycle.
    //    If called using loc, then when the component is mounted, it will be using
    //    *the previous PAGE's* loc info at first render, rather than the current url.
    //    This means it could send a fetch request using old paramaters.
    //    Since store *will* update, to the currentl url, which then updates mSTP loc
    //    Then (provided componentWillReceiveProps re-fetches data or re-sets state, when necessary)
    //    the app won't break, and correct itself.  It just requires and additional
    //    render, and perhaps an additional fetch.
    //    However, if called using routerProps initially, The first render and fetch
    //    will be correct.  In that case loc will still be updated asynch, but will
    //    not cause a change in the mapStateToProps data, or re-render, re-fetch,
    //    because loc for the component did not change when store was updated.
    //
    //

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


