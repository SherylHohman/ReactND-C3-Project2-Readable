import * as ReaderAPI from '../utils/api';
// import { HOME, getComputedUrlFromLocParamsAndRouteName } from './viewData';
// import { createSelector } from 'reselect';

// ACTION TYPES
 const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
 const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
 const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';

  export function fetchCategories(){
    return (dispatch) => {

      dispatch({ type: FETCH_CATEGORIES });
        // TODO: show loading spinner

        ReaderAPI.fetchCategories()
        // fetchCategoriesAPI()
          .then((response) => {

            if (!response.ok) {
              console.log('__response NOT OK, fetchCategories');
              throw Error(response.statusText);
            }
            // TODO
            // dispatch({
            //   type: IS_LOADING_FALSE,
            //   showLoadingSpinner: false,
            // });
            return response;

          })
          .then((response) => response.json())
          .then((data) => {
            // data.categories is array of category objects {name, url}
            const categoriesObject = data.categories.reduce((acc, category)=>{
              return {
                ...acc,
                // index categories on the path !!!, not the name
                [category.path]: category,
              }
            }, {})

            return dispatch({
              type: FETCH_CATEGORIES_SUCCESS,
              categories: categoriesObject,
            })}
          )
          .catch(err => {
            console.error(err);  //  in case of render error
            dispatch({
              type: FETCH_CATEGORIES_FAILURE,
              err,
              error: true,
            })
          });

    }; // dispatch wrapper
};


// INITIAL STATES
  const categoriesInitialState = {};


// REDUCER(s)
  function categories(state=categoriesInitialState, action){
    switch (action.type){
      case FETCH_CATEGORIES_SUCCESS:
        return ({
          ...state,
          ...action.categories
          // TODO: turn loading spinner off
        });
      case FETCH_CATEGORIES:
        return ({
          ...state,
          //  TODO: turn loading spinner on
        });
      case FETCH_CATEGORIES_FAILURE:
        return ({
          ...state,
          // TODO: turn loading spinner off
          // TODO: could set an error message on some state to handle errors
        });

      default:
        return state;
    }
  }
export default categories;

// SELECTORS
// export const getCategoriesArray = createSelector(
//     store => store.categories,
//     (categories) => Object.keys(categories).reduce((acc, categoryKey) => {
//       return acc.concat([categories[categoryKey]]);
//      }, [])
//   );
// export const getValidCategoryPaths = createSelector(
//     store => store.categories,
//     (categories) => {
//       return Object.keys(categories)
//         .reduce((acc, categoryKey) => {
//           console.log('recomputing validCategoryPaths');  // for monitoring how app/reselect works
//           return acc.concat([categories[categoryKey].path]);
//          }, [])
//         // home path must be LAST in array, so indexOf searches will work as indended
//         .concat(HOME.category.path)
//   });
// // const validCategoryPaths = getValidCategoryPaths;
// // console.log('__validCategoryPaths', validCategoryPaths);

// const computedCategoryUrl = (loc) => getComputedUrlFromLocParamsAndRouteName('category', loc);

// export  const getSelectedCategoryPath = createSelector(
//     store => store.viewData.loc,
//     getValidCategoryPaths,
//     (loc, validCategoryPaths) => {
//       console.log('--++------------',loc);
//       console.log('getSelectedCategoryPath',
//                   '\nloc:', loc,
//                   '\ncategories:', categories,
//                   '\nvalidCategoryPaths', validCategoryPaths
//                  );
//       // determine if currentUrl EXACTLY matches a valid Category Url
//       const categoryPath = loc.categoryPath || null;  // || ''

//       console.log('__validCategoryPaths', validCategoryPaths);
//       if ((validCategoryPaths.indexOf(categoryPath) !== -1) &&
//           // in case more ROUTES get added that incorporate categoryPath (categoryPath)
//           // (loc.url === ROUTES.category.base + categoryPath)
//           (loc.url === computedCategoryUrl(loc))
//           ){
//         return categoryPath;
//       }
//       else {
//         // any other url memoizes as null, to ensure
//         //  categories won't re-render on non Categories route
//         //  (Categories shows on all pages, not just '/:categoryPath')
//         return null;
//       }
//     }
//   );
