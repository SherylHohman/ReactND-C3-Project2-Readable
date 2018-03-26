// import * as ReaderAPI from '../utils/api';
// // constants
// import { HOME, computeUrlFromParamsAndRouteName } from './viewData';
// // libraries
// import { createSelector } from 'reselect';
// import { combineReducers } from 'redux';

// CONSTANTS
  // For consistancy,
  // Add a "category" definition for the home page: posts for "All" Categories
  // ALL_POSTS_CATEGORY compliments the "categories" defined on server,
  // could be: {name: 'All', path:''} // name is the display name for the category
  export const ALL_POSTS_CATEGORY= {name: '', path: ''};

// ACTION TYPES
  export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
  export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
  export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';

//   export function fetchCategories(){
//     return (dispatch) => {

//       dispatch({ type: FETCH_CATEGORIES });
//         // TODO: show loading spinner

//         ReaderAPI.fetchCategories()
//         // fetchCategoriesAPI()
//           .then((response) => {

//             if (!response.ok) {
//               console.log('__response NOT OK, fetchCategories');
//               throw Error(response.statusText);
//             }
//             return response;

//           })
//           .then((response) => response.json())
//           .then((data) => {
//             // data.categories is array of category objects {name, url}
//             const categoriesObject = data.categories.reduce((acc, category)=>{
//               return {
//                 ...acc,
//                 // index categories on the path !!!, not the name
//                 [category.path]: category,
//               }
//             }, {})

//             return dispatch({
//               type: FETCH_CATEGORIES_SUCCESS,
//               categories: categoriesObject,
//             })}
//           )
//           .catch(err => {
//             console.error(err);  //  in case of render error
//             dispatch({
//               type: FETCH_CATEGORIES_FAILURE,
//               err,
//               error: true,
//             })
//           });

//     }; // dispatch wrapper
// };


// // INITIAL STATES
//   const categoriesInitialState = {};

//   const fetchStatusInitialState = {
//     isLoading: false,
//     isFetchFailure: false,
//     errorMessage: '',
//   }

// // REDUCER(s)
//   function fetched(state=categoriesInitialState, action){
//     switch (action.type){
//       case FETCH_CATEGORIES_SUCCESS:
//         return ({
//           ...state,
//           ...action.categories
//         });
//       case FETCH_CATEGORIES:
//       case FETCH_CATEGORIES_FAILURE:
//         return ({
//           ...state,
//         });

//       default:
//         return state;
//     }
//   }

// function fetchStatus(state=fetchStatusInitialState, action){
//   switch (action.type){
//     case FETCH_CATEGORIES:
//       return ({
//         ...state,
//         isLoading:      true,
//         isFetchFailure: false,
//         errorMessage:   '',
//       });
//     case FETCH_CATEGORIES_SUCCESS:
//       return ({
//         ...state,
//         isLoading:      false,
//         isFetchFailure: false,
//         errorMessage:   '',
//       });
//     case FETCH_CATEGORIES_FAILURE:
//       return ({
//         ...state,
//         isLoading:      false,
//         isFetchFailure: true,
//         errorMessage:   action.err,
//       });
//     default:
//       return state;
//   }
// }
// const categories = combineReducers({
//   fetched,
//   fetchStatus,
// });
// export default categories


// // SELECTORS
// export const getFetchStatus      = (store) => store.categories.fetchStatus;
// export const getCategoriesObject = (store) => store.categories.fetched;

// //  categories don't change during the life of the app (they are defined in server file),
// //  These *should* only need be computed once each (at most) ! (once the categories are fetched, that is)
// // call as getCategoriesArray(store)
// export const getCategoriesArray = createSelector(
//     getCategoriesObject,    //(store)

//     (categoriesObj) => {
//       const catagoriesArray = Object.keys(categoriesObj).reduce((acc, categoryKey) => {
//         // console.log('+++ categories.js, recomputing getCategories_ARRAY');  // for monitoring how app/reselect works
//         return acc.concat([categoriesObj[categoryKey]]);
//       }, [])
//      // does NOT include an entry "All" or "" for All Categories
//       // console.log('  + categories.js, getCategories_ARRAY', catagoriesArray);  // for monitoring how app/reselect works

//       return catagoriesArray;
//     }
// );

// // call as getValidCategoryPaths(store)
// export const getValidCategoryPaths = createSelector(
//     getCategoriesArray,    //(store)

//     (categoriesArray) => {
//       // console.log('+++ categories.js, recomputing getValidCategory_PATHS');  // for monitoring how app/reselect works
//         const validCategoryPaths = categoriesArray.map((category) => {
//           return category.path;
//         })
//         // home path must be LAST in array, so indexOf searches will work as indended
//         .concat(HOME.category.path)
//       // console.log('  + categories.js, validCategory_PATHS:', validCategoryPaths);  // for monitoring how app/reselect works

//     return validCategoryPaths;
//     }
// );

// // call as getCategoryNames(store)
// export const getCategoryNames = createSelector(
//     // used for populating category drop down selector options in new/edit post
//     getCategoriesArray,    //(store)

//     (categoriesArray) => {
//       // console.log('+++ categories.js, recomputing getCategory_NAMES');  // for monitoring how app/reselect works

//       return categoriesArray.map((category) => {
//           return category.name;
//       });
//       // does NOT include an entry "All" or "" for All Categories
//     }
// );

// // valid /:category routes - vs 404
// // call as getCategoryNames(store)
// export const getValidCategoryUrls = createSelector(
//     getValidCategoryPaths,    //(store)
//     (categoryPaths) => {
//       // console.log('+++ categories.js, recomputing getValidCategory_URLS');  // for monitoring how app/reselect works
//       let validUrls = categoryPaths.map((categoryPath) => {
//         // return'/' + path;
//         return computeUrlFromParamsAndRouteName({ categoryPath }, 'category');
//       });
//       // home path was added to getValidCategoryPaths, so no need to add it here.
//       // console.log('  + categories.js, validCategory_URLS:', validUrls);  // for monitoring how app/reselect works
//       return validUrls;
//     }
// );

// // TODO: why did I create a selector here ? could be a constant.
// // call as getCategoryUrlToPath(store)
// export const createCategoryUrlToPathLookup = createSelector(
//   getValidCategoryPaths,    //(store)

//   (categoryPaths) => {
//       // console.log('+++ categories.js, recomputing getValidCategory_URLS');  // for monitoring how app/reselect works
//     let urls = categoryPaths.reduce((acc, categoryPath) => {
//       const url = computeUrlFromParamsAndRouteName({ categoryPath }, 'category');
//       acc[url] = categoryPath;
//       return acc;
//       }, {});

//     return urls;
//   }
// );

