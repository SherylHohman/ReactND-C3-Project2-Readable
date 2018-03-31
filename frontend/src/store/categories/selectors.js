import { createSelector } from 'reselect';
// Constants
import { HOME, computeUrlFromParamsAndRouteName } from '../viewData/constants';
// Selectors
import { getLocFrom } from '../viewData/selectors';


// SELECTORS
export const getFetchStatus = createSelector(
  (store) => store.categories.fetchStatus,
  (fetchStatus) => fetchStatus
);

export const getCategoriesObject = createSelector(
  (store) => store.categories.fetched,
  (categoriesObject) => {
    // categoriesObject should NEVER change during life of App ONCE INITIAL FETCH COMPLETES
    // console.log('+++ categories.js, recomputed getCategories_OBJECT, categoriesObject:', categoriesObject);  // for monitoring how app/reselect works
    return categoriesObject
  }
);


//  categories don't change during the life of the app (they are defined in server file),
//  These *should* only need be computed once each (at most) ! (once the categories are fetched, that is)

// call as getCategoriesArray(store)
export const getCategoriesArray = createSelector(
    getCategoriesObject,    //(store)

    // TODO: WHY?? is this recomputing? categoriesObj NEVER changes after INITIAL FETCH !!
    (categoriesObj) => {
      const catagoriesArray = Object.keys(categoriesObj).reduce((acc, categoryKey) => {
        return acc.concat([categoriesObj[categoryKey]]);
      }, [])
      // does NOT include an entry "All" or "" for All Categories

      // console.log('+++ categories.js, recomputed getCategories_ARRAY', catagoriesArray);  // for monitoring how app/reselect works
      return catagoriesArray;
    }
);

// call as getValidCategoryPaths(store)
export const getValidCategoryPaths = createSelector(
    getCategoriesArray,    //(store)

    (categoriesArray) => {
        const validCategoryPaths = categoriesArray.map((category) => {
          return category.path;
        })
        // home path must be LAST in array, so indexOf searches will work as indended
        .concat(HOME.category.path)

        // console.log('+++ categories.js, recomputed validCategory_PATHS:', validCategoryPaths);  // for monitoring how app/reselect works
    return validCategoryPaths;
    }
);

// call as getCategoryNames(store)
export const getCategoryNames = createSelector(
    // used for populating category drop down selector options in new/edit post
    getCategoriesArray,    //(store)

    (categoriesArray) => {
      return categoriesArray.map((category) => {
          console.log('+++ categories.js, recomputing getCategory_NAMES:', category.name);  // for monitoring how app/reselect works
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
      let validUrls = categoryPaths.map((categoryPath) => {
        // return'/' + path;
        return computeUrlFromParamsAndRouteName({ categoryPath }, 'category');
      });
      // home path was added to getValidCategoryPaths, so no need to add it here.
      // console.log('+++ categories.js, recomputed getValidCategory_URLS:', validUrls);  // for monitoring how app/reselect works
      return validUrls;
    }
);

// call as createCategoryUrlToPathLookup(store)
// TODO: rename to getCategoryUrlToPathLookup, since it's a selector
export const createCategoryUrlToPathLookup = createSelector(
  getValidCategoryPaths,    //(store)

  (categoryPaths) => {
    let lookUpTable = categoryPaths.reduce((acc, categoryPath) => {
      const url = computeUrlFromParamsAndRouteName({ categoryPath }, 'category');
      acc[url] = categoryPath;
      return acc;
      }, {});
    // console.log('+++ categories.js, recomputed createCategoryUrlToPathLookup_URLS:', lookUpTable);  // for monitoring how app/reselect works
    return lookUpTable;
  }
);

// call as getCategoryUrlToPath(store, routerProps)
export const getCurrentCategoryPath  = createSelector(
  (store, routerProps) => getLocFrom(store, routerProps).url,
  (store) => getValidCategoryUrls(store),
  (store) => createCategoryUrlToPathLookup(store),

  (currentUrl, validCategoryUrls, categoryUrlToPathLookup) => {
    // see if currentUrl EXACTLY matches a valid Category Url
    if (!currentUrl || (validCategoryUrls.indexOf(currentUrl) === -1)){
      // browser is not on a category path, memoise null to prevent re-render

      // Actually, memoizing null doesn't work. Must customize
      //  shouldComponentUpdate to return false if prev AND curr are BOTH NULL
      //  REM: '' indicates Home path, which displays "All" categories

      // for monitoring how app/reselect works
      // console.log('categories.selectors getCurrentCategoryPath',
      //             '\ncurrentUrl:', currentUrl,
      //             '\nvalidCategoryUrls:', validCategoryUrls,
      //             '\ncategoryUrlToPathLookup:', categoryUrlToPathLookup,
      //             '\ncategoryUrlToPathLookup[currentUrl]: null'
      //             );

      return null;
    }
      // for monitoring how app/reselect works
      // console.log('categories.selectors getCurrentCategoryPath',
      //             '\ncurrentUrl:', currentUrl,
      //             '\nvalidCategoryUrls:', validCategoryUrls,
      //             '\ncategoryUrlToPathLookup:', categoryUrlToPathLookup,
      //             '\ncategoryUrlToPathLookup[currentUrl]:', categoryUrlToPathLookup[currentUrl]
      //           );  //  app and reselect monitoring

    return categoryUrlToPathLookup[currentUrl]
  }
);


