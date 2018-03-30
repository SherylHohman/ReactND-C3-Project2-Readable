import { createSelector } from 'reselect';
import { ROUTES, findRouteNameOfRoute } from './constants';

// routerProps helper function, NOT an actionCreator - not sure what file to place this func in
import { isExactBrowserUrl } from './actionCreators';


// SELECTORS - SORT (ie non LOC items)

  // creating selectors here, because considering changing state format.
  //  This way I won't need update my Posts component to pass (store) when I do.

  // export const getSortBy    = store.viewData.persistentSortBy;
  export const getSortBy = createSelector(
      (store) => store.viewData.persistentSortBy,
      (sortBy) => { return sortBy }
  );
  // export const getSortOrder = store.viewData.persistentSortOrder;
  export const getSortOrder = createSelector(
      (store) => store.viewData.persistentSortOrder,
      (sortOrder) => { return sortOrder }
  );


// SELECTORS - LOC

  const getLocFromStoreFunc = (store) => {
    return store.viewData.loc;
  }
  const getLocFromStore = createSelector(
    (store) => getLocFromStoreFunc(store),
    (loc) => {
      // console.log('recomputing getLocFromStore - in getLocFromStore, \nloc.url:', loc.url);
      return loc;
    }
  );

  //  (routerProps is not store, but is like store in that it is the source of truth for Urls.)
    //  viewData.loc simply saves (essential info from) routerProps to store
    //  * after-the-fact *
    //  routerProps is very related to viewData.loc, and a precursor to its store

  // should only be called externall from viewData.actionCreators
  //   (or internally from getLocFrom)
  export const getLocFromRouter = createSelector(
    (routerProps) => {

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
      }

      // console.log('recomputing getLocFromRouter - in getLocFromRouter, as \nloc:', loc);
      return(loc);
    },

    (loc) => loc
  );


  // MUST be called with (store, routerProps=null) //routerProps optional, store is NOT
  export const getLocFrom = createSelector(
    (store, routerProps=null) => {
      let loc;
      // only interested in routerProps when it matched on a Full PAGE route
      if (!routerProps || !isExactBrowserUrl(routerProps)){
        // console.log('vieData.selectors, getLocFrom NOT using ROUTERPROPS',
        //             '\nisExactBrowserUrl:', isExactBrowserUrl(routerProps),
        //             '\nrouterProps:', routerProps,
        //             );
        // null flags selector to instead go fetch the value already in store
      // console.log('recomputed getLocFromRouter as \nNULL');
        return null;
      }
      loc = getLocFromRouter(routerProps);
      // console.log('vieData.selectors, getLocFrom, loc after calling getLoc.routerProps', loc);
      return loc;
    },
    (store, routerProps=null) => {
        // console.log('recomputing getLocFromStore');
        if (!store) {
          // console.log('ERROR: viewData.getLocFrom, ',
          //             'REQUIRES: "(store)" argument, or "(store, routerProps)" as arguments',
          //             '\nstore:', store,
          //             '\nrouterProps:', routerProps,
          //             );
          return null
        };
        const loc = getLocFromStore(store);
        // console.log('recomputed getLocFromStore as \nloc:', loc);
        return loc;
      },

    (locFromRouter, locFromStore) => {
      if (!locFromRouter) {
        // console.log('returning loc from store because NO Router, \nloc:', locFromStore);
        return locFromStore;
      }

      // if router and store have the same info, return from store, not Router
      const urlR = locFromRouter.url;
      const urlS = locFromStore.url
      if (urlR === urlS) {
        // console.log('returning loc from store because SAME, \nloc:', locFromStore);
        return locFromStore;
      }

      const keysR = Object.keys(urlR);
      if (keysR.length !== Object.keys(urlS).length){
        // console.log('returning loc from router because NOT Same, \nloc:', locFromRouter);
        return locFromRouter;
      }

      const hasChanged = keysR.any(key => {
        return urlR[key] !== urlS[key]
      });
      // console.log('deep loc returning:', hasChanged ? 'locFromRouter' : 'locFromStore')
      return hasChanged ? locFromRouter : locFromStore

      // console.log('returning loc from routerProps, \nloc:', locFromRouter)
      // return locFromRouter;
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
