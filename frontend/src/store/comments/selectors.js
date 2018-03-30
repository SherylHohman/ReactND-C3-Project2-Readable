import { createSelector } from 'reselect';

// SELECTORS
export const getFetchStatus = (store) => store.comments.fetchStatus;
const getCommentsObject     = (store) => store.comments.fetched;
  // Warning: includes deleted comments and comments from deleted posts


// removes deleted comments, and comments from deleted posts
const getCommentsArray = createSelector(
  getCommentsObject,
  (commentsObject) => {
    return (
      Object.keys(commentsObject)
      .reduce((acc, commentId) => {
        return acc.concat([commentsObject[commentId]]);
       }, [])
      .filter((comment) => !comment.deleted && !comment.parentDeleted)
    );
  }
);

// most recently edited/added to the top/start of the list
export const getSortedComments = createSelector(
  getCommentsArray,
  (comments) => {
    return (
      comments.sort((commentA, commentB) => {
        if (commentA === commentB) return 0;
        if (commentA.timestamp < commentB.timestamp) return 1;
        return -1;
      })
    );
  }
);
