import { createSelector } from 'reselect';

// Constants
import { HOME, computeUrlFromParamsAndRouteName } from '../viewData/constants';


// SELECTORS
export const getFetchStatus      = (store) => store.categories.fetchStatus;
export const getCategoriesObject = (store) => store.categories.fetched;

//  categories don't change during the life of the app (they are defined in server file),
//  These *should* only need be computed once each (at most) ! (once the categories are fetched, that is)

// call as getCategoriesArray(store)
export const getCategoriesArray = createSelector(
    getCategoriesObject,    //(store)

    (categoriesObj) => {
      const catagoriesArray = Object.keys(categoriesObj).reduce((acc, categoryKey) => {
        // console.log('+++ categories.js, recomputing getCategories_ARRAY');  // for monitoring how app/reselect works
        return acc.concat([categoriesObj[categoryKey]]);
      }, [])
      // does NOT include an entry "All" or "" for All Categories
      // console.log('  + categories.js, getCategories_ARRAY', catagoriesArray);  // for monitoring how app/reselect works

      return catagoriesArray;
    }
);

// call as getValidCategoryPaths(store)
export const getValidCategoryPaths = createSelector(
    getCategoriesArray,    //(store)

    (categoriesArray) => {
        // console.log('+++ categories.js, recomputing getValidCategory_PATHS');  // for monitoring how app/reselect works
        const validCategoryPaths = categoriesArray.map((category) => {
          return category.path;
        })
        // home path must be LAST in array, so indexOf searches will work as indended
        .concat(HOME.category.path)
        // console.log('  + categories.js, validCategory_PATHS:', validCategoryPaths);  // for monitoring how app/reselect works

    return validCategoryPaths;
    }
);

// call as getCategoryNames(store)
export const getCategoryNames = createSelector(
    // used for populating category drop down selector options in new/edit post
    getCategoriesArray,    //(store)

    (categoriesArray) => {
      // console.log('+++ categories.js, recomputing getCategory_NAMES');  // for monitoring how app/reselect works
      return categoriesArray.map((category) => {
          return category.name;
      });
      // does NOT include an entry "All" or "" for All Categories
    }
);

// valid /:category routes - vs 404
// call as getCategoryNames(store)
export const getValidCategoryUrls = createSelector(
    getValidCategoryPaths,    //(store)
    (categoryPaths) => {
      // console.log('+++ categories.js, recomputing getValidCategory_URLS');  // for monitoring how app/reselect works
      let validUrls = categoryPaths.map((categoryPath) => {
        // return'/' + path;
        return computeUrlFromParamsAndRouteName({ categoryPath }, 'category');
      });
      // home path was added to getValidCategoryPaths, so no need to add it here.
      // console.log('  + categories.js, validCategory_URLS:', validUrls);  // for monitoring how app/reselect works
      return validUrls;
    }
);

// TODO: why did I create a selector here ? could be a constant.
// call as getCategoryUrlToPath(store)
export const createCategoryUrlToPathLookup = createSelector(
  getValidCategoryPaths,    //(store)

  (categoryPaths) => {
    // console.log('+++ categories.js, recomputing getValidCategory_URLS');  // for monitoring how app/reselect works
    let urls = categoryPaths.reduce((acc, categoryPath) => {
      const url = computeUrlFromParamsAndRouteName({ categoryPath }, 'category');
      acc[url] = categoryPath;
      return acc;
      }, {});

    return urls;
  }
);

