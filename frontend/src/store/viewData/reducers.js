// Action Types
import * as actionTypes from './constants';
// Constants
import { HOME, ROUTES } from './constants';
import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from './constants';


// ACTION TYPES
const { CHANGE_VIEW, SORT_BY } = actionTypes;
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
    },

    // sort method: 'by votes' or 'by date'
    persistentSortBy:    DEFAULT_SORT_BY,
    persistentSortOrder: DEFAULT_SORT_ORDER,
  }


// REDUCERS

  function viewData(state=initialState_ViewData, action){
    switch (action.type) {
      case CHANGE_VIEW:
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
