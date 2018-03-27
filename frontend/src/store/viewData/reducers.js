// constants
import { HOME, ROUTES } from './constants';
import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from './constants';
import * as actionTypes from './constants';

// ACTION TYPES
const { CHANGE_VIEW, SELECT_CATEGORY, SORT_BY } = actionTypes;
// TODO: (implement then import) SORT_ORDER

// DATA, INITIAL, SAMPLE

  //  "url" is an exact path, as per browser window
  //  (params, when exist are:) "categoryPath", "postId"
  //  ("categoryPath" is a url-safe string for the category url. Not including'/'')
  //  "route" is a route format, where `:` prefix represents a variable name
  //  "sortOrder" is "Ascending" or "Descending". Not implemented.

  const initialState_ViewData = {
    loc: {
      url:  HOME.url,
      route:     ROUTES.home,
      routeName: ROUTES.home.routeName,
      // store params directly on loc
      ...ROUTES.home.params,  // home route has NO params (currently)

      // match: HOME.url,
      //  not currently used..
      //  Leaving definition here, so it's easily available if decide to implement
      //    it is the "matched portion of the route" as determined by <Route> and <Switch>
      //    not necessarily the same as the route in the url
      //  TODO: what "default value should match be set to: home, null,,
    },
    // sort method: 'by votes' or 'by date'
    persistentSortBy:    DEFAULT_SORT_BY,
    persistentSortOrder: DEFAULT_SORT_ORDER,
  }

// REDUCERS

  function viewData(state=initialState_ViewData, action){
    // console.log('entering reducer viewData, prevState', state);
    // console.log('entering reducer viewData, action:'  , action);
    switch (action.type) {
      case CHANGE_VIEW:
        // console.log('viewData state: ', state);
        // console.log("viewData-actionType _CHANGE_VIEW, action:", action);
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
