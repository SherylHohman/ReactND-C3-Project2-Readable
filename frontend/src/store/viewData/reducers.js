// import { combineReducers } from 'redux';
// ACTION TYPES
import { CHANGE_VIEW, SORT_BY } from './constants';
// CONSTANTS
import { ROUTES } from './routes';
import { HOME, DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from './constants';
// import { ROUTES } from './constants';

// DATA, INITIAL, SAMPLE

  //  "url" is an exact path, as per browser window
  //  (params, when exist are:) "categoryPath", "postId"
  //  ("categoryPath" is a url-safe string for the category url. Not including'/'')
  //  "route" is a route format, where `:` prefix represents a variable names
  //          Note: this is the "matched" portion of the route that proppted the
  //          component to mount/render - Not Necessarily the route for Full Browser Url
  //  "match" // not implemented
  //  "sortOrder" is "Ascending" or "Descending". Not implemented.

  const initialState_ViewData = {
    // also update viewData.reducers.getParamsFromStore if loc definition changes
    loc: {
      url:       HOME.url,
      route:     ROUTES.home,
      routeName: ROUTES.home.routeName,
      // store params directly on loc
      ...ROUTES.home.params,  // === []

      // match: HOME.url,
      //  not currently used..
      //  Leaving definition here, so it's easily available if decide to implement
      //    It is the "matched portion of the route" as determined by
      //    <Route> and <Switch> - not necessarily the same as the route in the url
      //    The url fragment that prompted the calling component to mount/render
    },
    // sort methods: 'by votes' or 'by date'
    persistentSortBy:    DEFAULT_SORT_BY,
    persistentSortOrder: DEFAULT_SORT_ORDER,
  }

  function viewData(state=initialState_ViewData, action){
    switch (action.type) {
      case CHANGE_VIEW:
        if (action.loc.url === state.loc.url) {
            //  the two loc objects contain the same data.
              //  Do not update state.loc with a new object reference.
              //  (prevents unnecessary re-rendering due to the way loc)
              //  (data is derived)
            console.log('viewData.reducers.viewData, url has Not changed, not updating store.viewData.loc..',
                        'store.loc:',  state.loc,
                        'action.loc:', action.loc,
                       );

            return state;
        }
        return  ({
                  ...state,
                  loc: action.loc,
                });
      case SORT_BY:
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


