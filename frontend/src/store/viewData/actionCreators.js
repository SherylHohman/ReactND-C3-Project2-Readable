//  ACTION TYPES
import { CHANGE_VIEW, SORT_BY } from './constants';
// CONSTANTS
import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from './constants';
// SELECTORS
import { getLoc, routerPropsIsExactMatch } from './selectors';

// ACTION CREATORS

  export const changeView = (routerProps, prevRouterProps=null) => (dispatch) => {
    // if (!routerPropsIsExactMatch(routerProps)) {
    //   //  Only want store to save loc data for EXACT (Browser Bar) url's.
    //   //  NOT partial url data matched by components that render of multiple pages.
    //   //  This is a safety net, in case a non-PAGE component calls changeView.
    //   console.log('WARNING: routerProps for this component is not an EXACT match',
    //               '\n- will NOT update store.viewData.loc, with this',
    //               '\n component\'\'s routerProps:', routerProps,
    //              );
    //   return;
    // }

    const loc = getLoc(routerProps);
    const prevLoc = prevRouterProps ? getLoc(prevRouterProps) : null;

    if (loc.url === (prevLoc && prevLoc.url)) {
      // url hasn't changed: don't update store
      console.log('viewData.changeView, url has Not changed, not updating store.viewData.loc..',
                  'prev url:', prevLoc.url,
                  'curr url:', loc.url
                 );
      return;
    }
    // note:  this function does Not have direct access to store, so cannot
    //        simply compare urls.
    //        Also, This performance check depends on user supplying 2nd param
    //        TODO: is there a way to check for a "same" url (therefore loc data)
    //              within the reducer?? if so, is it kosher to do so??

    dispatch ({
      type: CHANGE_VIEW,
      loc,
    })
  }

  export const changeSort = (persistentSortBy=DEFAULT_SORT_BY) => ({
    // TODO: add SortBy field to (browser) url ??
    //   if so, then would need to push/concat the new URL
    // TODO: either validate the param given, or
    //       use sortByMethods constant to populate Component SortBy links
    type: SORT_BY,
    persistentSortBy,
  })

  // TODO: implement User selectable sort order
  // export const sortOrder = ({  }) => ({
  //   type: SORT_ORDER,
  //   sortOrder: 'DESCENDING'
  // })

