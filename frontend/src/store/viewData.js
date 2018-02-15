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

  // export const sortOrder = ['decending', 'ascending'];

  // TODO: get paths from App.js, then use to populate App.js
  export const routes = [
    {route: '/',                       label: 'home'}, // or 'posts' ?
    {route: '/category/:categoryPath', label: 'category'},
    {route: '/post/:postId',           label: 'post'},
    {route: '/post/:postId/edit',      label: 'edit-post'},
    {route: '/post/new',               label: 'new-post'},
  ];

  // "id" is one of: post.id, comment.id, category.name
  // "url" is an exact path, as per browser window
  // "route" is a route format, where `:` prefix represents a variable name
  // "sortOrder" is "Ascending" or "Descending". Not implemented.
  // "category.path" is a url-safe string for the category url. Not including'/''

  // ensure consistancy
  const ALL_POSTS_CATEGORY= {name: '', path: ''} // name '' or null ??
  const ALL_POSTS_ID  = '' ;  // or null ??
  const ALL_POSTS_URL = '/';
  export const DEFAULT_SORT_BY = 'date';
  export const DEFAULT_SORT_ORDER = 'high_to_low';

  export const HOME  = {
    id: ALL_POSTS_ID,
    url: ALL_POSTS_URL,
    category: ALL_POSTS_CATEGORY,
  }

  // export const getPersistentCategory(){
  //   return store.viewData.persistentCategoryPath;
  // };
  // export const getPersistentSort(){
  //   return store.viewData.persistentCategoryPath;
  // };

  // TODO: delete this one in favor of uri.js
  export function getUri(routerInfo){
    const match    = (routerInfo && routerInfo.match)    || null;
    const location = (routerInfo && routerInfo.location) || null;
    return ({
      route:  match.path   || HOME.url,
      url:    match.url    || location.pathname || null,
      params: match.params || null,
      postId:       match.params.postId       || null,
      categoryPath: match.params.categoryPath || null,

      // TESTING to replace postId and categoryPath above
      currentId: match.params.postId || match.params.categoryPath || HOME.category.path,

      // // TESTING this is viewData, but it's related to params. Not sure if it makes
      // //  good or bad sense to have "here" also/instead of viewData
      // //  it should get updated whenever the route is a category route, and
      // //    the currentCategoryPath is different from the stored persistentCategoryPath
      // persistentCategoryPath: match.params.categoryPath || store.viewData.persistentCategoryPath || HOME.category.path,

      // TODO: store currentSort info in url (persistent shall still be in Uri)
      // search: location.search || null,

      //TODO: so can link to location on page (top of comments, add comment, etc)
      // hash:   location.hash   || null,
    })
  }

// ACTION CREATORS

  export const changeView = (newViewData=HOME) => {
      // console.log('____entering viewData.changeView, newViewData:', newViewData);

    // TODO: refactor app so that "by uri" is the ONLY way this func is called
    // TODO: also, change persistentCategory (a category object {name, path})
    //       to persistentCategoryPath (string)

    // TODO: (I can also get rid of currentUrl and currentId, but it's convenient
    // to have them around.. or replace them with
    //  - a helper function to pull the values off the router history/match objects)

    // changeView By uri
    const uri = newViewData.uri;
    if (uri){
      // console.log('__have new uri:', uri);

      if (uri.route ==="/"){
          return ({
            type: CHANGE_VIEW,
            currentUrl: uri.url,
            currentId:  HOME.category.path,

            persistentCategory: HOME.category,  // category object
            // TODO: refactor components to (below) this instead (of above)
            persistentCategoryPath: HOME.category.path,  //string
          })
      }

        // by uri: category
        if (uri.route === "/category/:categoryPath") {
        // TODO: instead, check against if categoryPath is in the param list - don't hard code the route

          // TODO access store.categories to get "categories" from the Path
          //  OR (better) REFACTOR so I only need the Path for changeView !!
          //  AND all Components Expect that viewData holds the Path,
          //  not the whole category

          // const category = (newCategory.name)  // '' or null
          //   ? newCategory
          //   : ALL_POSTS_CATEGORY;

          return ({
            type: CHANGE_VIEW,
            currentUrl: uri.url,
            currentId:  uri.params.categoryPath,

            persistentCategory: {
              name: uri.params.categoryPath,  // technically incorrect!!
              // (above) don't have access to categories to parse this properly.
              //  It's the same value in MY dataset (currently)
              path: uri.params.categoryPath,  //{ name, path }
            },
            // TODO: refactor components to use below instead
            persistentCategoryPath: uri.params.categoryPath,  //string
          })
        }

        // by uri: Url, Id
        if ((uri.route === "/post/:postId") ||
            (uri.route === "/post/:postId/edit")) {
          return ({
            type: CHANGE_VIEW,
            currentUrl: uri.url,
            currentId:  uri.postId,
          })
        }
      }

    // changeView By Category

    const newCategory = newViewData.persistentCategory //|| null
    if (newCategory) {
      // console.log('___in changeView By Category, newViewData.category:', newViewData.category);

      const category = (newCategory.name)  // '' or null
        ? newCategory
        : ALL_POSTS_CATEGORY;

      // url and id are NOT independant of category, set them to ensure in synch
      // console.log('category.name:', category.name, 'category:', category)
      const url = (category.name)
                  ? `/category/${category.path}`
                  : `${HOME.category.path}`;
      const id = category.name;

      return ({
        type: SELECT_CATEGORY,
        currentUrl: url,
        currentId: id,
        persistentCategory: category,
        //  TODO refactor components to use below instead of above
        persistentCategoryPath: category.path,
      });

    // changeView By: url, id

    } else {
      // console.log('___in changeView-via-id/url, newViewData:', newViewData);

      // potential issue: if url is a category url, and/or id is a category..
      // the sticky category (object) won't get updated !!
      // The fix: parse URL. If it is '/category/:category', then treat it as
      // changeViewBCagetory ('SELECT_CATEGORY' above)

      return ({
        type: CHANGE_VIEW,
        currentUrl:  newViewData.currentUrl,
        // if not supplied, 'null' tells reducer to use "persistentCategory"
        currentId:   newViewData.currentId || null,
      })
    }
  }

  export const changeSort = (persistentSortBy='date') => ({
    // TODO: add this field to (browser) url ??
    //   if so, then would need to push the new URL
    // TODO: either validate the param given,
    //       or use sortByMethods to populate Component
    type: SORT_BY,
    persistentSortBy,
  })

  // export const sortOrder = ({  }) => ({
  //   type: SORT_ORDER,
  //   sortOrder: 'DESCENDING'
  // })


// DATA, INITIAL, SAMPLE

    // Assumes starts app from from Home Page url.
    // TODO read from react-router or Browser Window
    // TODO: set url, id with data from browser URL
    // TODO: parse url, and set sticky: category and sortBy from browser URL

  const initialState_ViewData = {
    // "current" FIELDS WILL GO AWAY, when can read/parse data from Browser Fields
    currentUrl: HOME.url,
    // holds: post.id, comment.id, or category.name, or '' (all posts)
    currentId:  HOME.id,
    // object eg: {name: 'react', path: 'react'}
    persistentCategory: HOME.category,
    //  TODO refactor components to use below instead of above
    persistentCategoryPath: HOME.category.path,
    // 'votes' or 'date'
    persistentSortBy:    DEFAULT_SORT_BY,
    persistentSortOrder: DEFAULT_SORT_ORDER,
  }

function viewData(state=initialState_ViewData, action){
  // console.log('entering reducer viewData, action:', action, 'prevState');
  // console.log('_ entering reducer viewData, action:', action);

  let id;
  let url;
  switch (action.type) {
    case CHANGE_VIEW:
      // console.log("__CHANGE_VIEW, action:", action);

      // potential issue: if url is a category route, or id is category.name
      //       then viewData's "category" (object) won't get updated.
      // TODO: parse URL and call selectCategory action creator instead.

      id = (action.currentId === null)
        ? state.persistentCategory.path
        : action.currentId
      // console.log('__CHANGE_VIEW, action.currentUrl, id', action.currentUrl, id)
      return  ({
                ...state,
                currentUrl: action.currentUrl,
                currentId: id,
              });

    case SELECT_CATEGORY:
      // console.log('SELECT_CATEGORY, action:', action);
      let category = action.persistentCategory;
      url = (category.path)
                ? `/category/${category.path}`
                : '/'    // home page: all categories
      id = category.path;
      return  ({
                ...state,
                currentUrl: url,
                currentId: id,
                persistentCategory: category,
                persistentCategoryPath: action.persistentCategoryPath,
              });

    case SORT_BY:
      return  ({
                ...state,
                // TODO sort method stored in url ??
                persistentSortBy: action.persistentSortBy,
              });

    default:
      return state;
  }
};

export default viewData


//  NOTE, I only need either currentUrl OR currentId.
