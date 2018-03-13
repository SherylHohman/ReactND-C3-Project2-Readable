// ACTION TYPES
export const CHANGE_VIEW = 'CHANGE_VIEW';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const SORT_BY = 'SORT_BY';
// export const SORT_ORDER = 'SORT_ORDER'; // Descending, Ascending


// Valid Values
  // TODO: Map over these to populate the Heading/Sort Options in the UI
  export const sortMethods = [
    {sortBy: "date", text: 'Most Recent'},
    {sortBy: "voteScore", text: 'Highest Votes'}
  ];
  export const sortOrder = [
    {sortOrder: "descending", text: 'High to Low'},
    {sortOrder: "ascending",  text: 'Low to High'}
  ];

  // TODO: get paths from App.js, then use to populate App.js
export const ROUTES= {
  home:     {
    base:     '/',
    param:    ''
    // param:    ':filter?',
  },
  category: {
    base:     '/',
    param:    ':categoryPath',
  },
  post:     {
    base:     '/category/',
    param:    ':postId',
  },
  editPost: {
    base:     '/post/edit/',
    param:    ':postId',
  },
  newPost:  {
    base:     '/post/new/',
    param:    '',
  },
}

  // "id" is one of: post.id, comment.id, category.name
  // "url" is an exact path, as per browser window
  // "route" is a route format, where `:` prefix represents a variable name
  // "sortOrder" is "Ascending" or "Descending". Not implemented.
  // "category.path" is a url-safe string for the category url. Not including'/''

  // ensure consistancy
  const ALL_POSTS_CATEGORY= {name: '', path: ''};
  const ALL_POSTS_ID  = '' ;
  const ALL_POSTS_URL = '/';
  export const DEFAULT_SORT_BY = 'date';
  export const DEFAULT_SORT_ORDER = 'high_to_low';

  export const HOME  = {
    id: ALL_POSTS_ID,
    url: ALL_POSTS_URL,
    category: ALL_POSTS_CATEGORY,
  }

  export function getUri(routerProps=null, store=null){
    // console.log('getUri, routerProps.match:', routerProps.match);
    const match    = (routerProps && routerProps.match)    || null;
    const location = (routerProps && routerProps.location) || null;
    if (!match) {
      console.log('getUri, no "match" object - possibly a child component that routeProps was not passed as props'); //return null;  //exit early
      return null;
    }
    // console.log('__let uri.params = match.params:', match.params);
    let uri = {
      // actual location, not just the "match"ed part
      url: location.pathname || null,

      // Combines params. postId and .categoryPath as UI just needs an id
      currentId: match.params.postId || match.params.categoryPath || HOME.category.path,

      // TODO: get rid of params, key, just store params in directly
      params: match.params || null,
      ...match.params,

      // note, this is the "matched" route - not necessarily the full route
      //  (for example: called from in Categories component,
      //   this will always be '/' because it always renders)
      route: match.path || ROUTES.label['home'].route,

      // I don't use match.url currently, but may as well make this complete so don't
      //  need to navigate the complex set of routerProps to access this info
      match: match.url,

      // NOTE: if component "matches" on a non-exact route,
      //  match.path and match.params may NOT reflect the full path
      //  For example, Categories is rendered on every path
      //  So ALWAYS match.path === '/' match.params === ''
      //    even on route '/:categories', path '/react', and params 'categoryPath: react'
      //  SO.. use location.pathname for actual url
      //    BUT.. would need to self-parse to get the params of the actual url.
    };
    return(uri);
  }

// ACTION CREATORS

  export const changeView = (newViewData=HOME) => (dispatch) => {
      // console.log('__++__entering viewData.CHANGEVIEW, newViewData:', newViewData);
      const uri = newViewData.uri;
      // console.log('__++__entering viewData.changeView, uri.currentId:', uri.currentId);
      dispatch ({
        type: CHANGE_VIEW,
        currentUrl: uri.url,
        currentId:  uri.currentId,
      })
}

  export const changeSort = (persistentSortBy='date') => ({
    // TODO: add this field to (browser) url ??
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


// DATA, INITIAL, SAMPLE

  const initialState_ViewData = {
    currentUrl: HOME.url,

    // stored value is a: post.id, comment.id, or category.name, or '' (all posts)
    currentId:  HOME.id,

    // sort method: 'by votes' or 'by date'
    persistentSortBy:    DEFAULT_SORT_BY,
    persistentSortOrder: DEFAULT_SORT_ORDER,
  }

function viewData(state=initialState_ViewData, action){
  // console.log('entering reducer viewData, prevState', state);
  // console.log('entering reducer viewData, action:'  , action);
  switch (action.type) {
    case CHANGE_VIEW:
      // console.log("_++_CHANGE_VIEW, action:", action);
      return  ({
                ...state,
                currentUrl: action.currentUrl,
                currentId:  action.currentId,
              });
    case SORT_BY:
      // console.log('SORT_BY, action:', action);
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
