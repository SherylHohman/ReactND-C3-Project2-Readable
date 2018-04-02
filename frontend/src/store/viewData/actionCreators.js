import { getLocFromRouter } from './selectors';
import * as actionTypes from './constants';
// Not a Selector - it's actually a helperFunction re:routerProps
// import { isExactBrowserUrl } from './selectors';

// ACTION TYPES
const { CHANGE_VIEW, SORT_BY } = actionTypes;
// TODO: (implement then import) SORT_ORDER


// // HELPER FUNCTIONS (for routerProps)  //(not sure which file to place this function)

  // TODO: move to selectors file, as that is the file that deals with the
  //       inner workings of routerProps, and knows its shape the best
  export function isExactBrowserUrl(routerProps){
    if (!routerProps || !routerProps.match){
      console.log('ERROR: viewData.isExactBrowserUrl is missing routerProps');
      return null;
    }
    return routerProps.match.url === routerProps.location.pathname;
  }

// ACTION CREATORS

  export const changeView = (routerProps, prevRouterProps=null) => (dispatch) => {
    // only save isEXACT browser url/routes to the store
    //   ie if the component matched on a url fragment
    //    then calls changeView - DONT. because
    //    its loc.params, loc.route, loc.routeName, (loc.match)
    //    will reflect only the portion of the url that it needed for the component to render

      const loc = getLocFromRouter(routerProps);
      if (!isExactBrowserUrl){
        console.log('Warning: viewData.actionCreators changeView, NOT saving',
                    ' routerProps to viewData.loc because this component\'\'s ',
                    'routerProps do not reflect the full URL in the address bar. ',
                    'Only Full Browser Urls (loc data) (ie from full page components) ',
                    'should be saved to store',
                    '\nrouterProps:', routerProps);
        return;
      }

      // TODO: re-write to pull prev value from store, rather than needing it to be passed in
      const prevLoc = prevRouterProps ? getLocFromRouter(prevRouterProps) : null;
      if (loc.url === (prevLoc && prevLoc.url)) {
        // url hasn't changed: don't update store
        //  due to the way loc is determined, a New Object Reference could
        //  be created, when the loc info inside it hasn't changed.
        //  In this case, leave store as is: if the url is the same, then so is
        //  everything else (since we're Not looking at or saving Partial Url Matches)
        //  See above: Only saving url/loc info for the Full Browser Bar Url.
        console.log('viewData.changeView, not updating store.loc, since the url has Not changed',
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
