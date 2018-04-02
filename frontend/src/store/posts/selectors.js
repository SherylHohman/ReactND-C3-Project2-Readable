import { createSelector } from 'reselect';

import { getLocFrom } from '../viewData/selectors';


// SELECTORS - Return store data in format ready to be consumed by UI

// export const getFetchStatus    = (store) => store.posts.fetchStatus;
export const getFetchStatus = createSelector(
  (store) => store.posts.fetchStatus,
  (fetchStatus) => fetchStatus
);

// export const getPostsAsObjects = (store) => store.posts.fetchedPosts;
export const getPostsAsObjects = createSelector(
  (store) => store.posts.fetchedPosts,
  (postsAsObjects) => postsAsObjects
);

// called as (store, routerProps)
export const getPosts = createSelector(
  getPostsAsObjects,
  (postObjects) => {
    if (!postObjects){ return []; }
    // object to array
    const postsArray = Object.keys(postObjects).reduce((acc, postId) => {
      return acc.concat([postObjects[postId]]);
    }, []);
    return postsArray;
  }
);

// TODO: this should be moved to viewData.selectors
// (store, routerProps=null)
// (routerProps is optional, but mSTP, connect WILL auto send all ownProps(aka routerProps) if avail,
export const getPostIdFrom = createSelector(
  getLocFrom,
  (loc) => loc.postId
);

// (store, routerProps=null)
// (routerProps is optional, but mSTP, connect WILL auto send all ownProps(aka routerProps) if avail,
export const getPostFrom = createSelector(
  getPostIdFrom,
  getPostsAsObjects,
  (postId, postsAsObjects) => {
    console.log('posts/selectors.getPostFrom, postId:', postId);
    console.log('posts/selectors.getPostFrom, postsAsObjects:', postsAsObjects);
    if (postId && Object.keys(postsAsObjects).length>0) {
      return postsAsObjects[postId]
    }
  }
);

// TODO: should this be moved to ROUTES (viewData/constants) ??
// B  -- requires less rendering and fewer function calls than A) (see Notes below)
const getRouterCategoryPath = (store, ownProps) =>
  (getLocFrom(store, ownProps.routerProps).categoryPath);

// (only valid Category Routes make it to this function)
export const getPostsCurrentCategory = createSelector(
  getPosts,
  getRouterCategoryPath,
  (allPosts, categoryPath) => {
    // home route (all posts) has no categoryPath
    if (!categoryPath) {return allPosts}
    const postsCurrentCategory = allPosts.filter( (post) => {
      return post.category === categoryPath;
    });
    return postsCurrentCategory;
  }
);

// TODO: save categorized posts filtered by category
// const getPostIdsByCategory = createSelector(
// );



  // KEEP THIS AS A NOTE ON SELECTOR DESIGN
    // // A  -- less efficient than B)
    // // A - requires more function calls, more rendering passes, (maybe fewer fetches?)
    // // Swap them out, with comments in place Here and in Posts to see the diff !
    // // A Doesn't memoise well!
    // // Difference is:
    // //  - this uses LOC as an input selector;
    // //  - that uses CATEGORYPATH as an input selector

    // // A
    // const getRouterLoc = (store, ownProps) =>
    //   (getLoc(ownProps.routerProps));

    // export const getPostsCurrentCategory = createSelector(
    //   getPosts,
    //   getRouterLoc,
    //   (allPosts, loc) => {
    //     console.log('posts.getPostsCurrentCategory, loc.categoryPath, allPosts', loc.categoryPath, allPosts);
    //     // if (loc.route === ROUTES.home.route){
    //     //   return allPosts;
    //     // }
    //     // (only valid Category Routes make it to this function)
    //     // home route has "falsey" categoryPath
    //     if (!loc.categoryPath) {return allPosts}
    //     const postsCurrentCategory = allPosts.filter( (post) => {
    //       return post.category === loc.categoryPath;
    //     });
    //     return postsCurrentCategory;
    //   }
    // );

    // const postIdsByCategory      = getPostIdsByCategory(store);
    // const postIdsCurrentCategory = postIdsByCategory[loc.currentId] || null;
