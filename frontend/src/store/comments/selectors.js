import { createSelector } from 'reselect';
// import { getComments, getFetchStatus } from './selectors';

// SAMPLE DATA

  // const store.comments = {
  //   fetched,
  //   fetchStatus,
  // }

  // sample fetchStatus = {
  //   isLoading: false,
  //   isFetchFailure: false,
  //   errorMessage: '',
  // }

  // sample fetched = {
  //   "894tuq4ut84ut8v4t8wun89g": { ...sampleComment },
  //   "andAnother [id] string":   {..anotherSampleComment},
  //    ...
  // };

  // store.comments.fetched is..
  //    an object of comment objects, where the key
  //    for each (comment object) is the same as the id for that comment.

  // sample comment = {
  //     id: '894tuq4ut84ut8v4t8wun89g',
  //     parentId: "8xf0y6ziyjabvozdd253nd",
  //     timestamp: 1468166872634,
  //     body: 'Hi there! I am a COMMENT.',
  //     author: 'thingtwo',
  //     voteScore: 6,
  //     deleted: false,
  //     parentDeleted: false
  //   }

// SELECTORS

  export const getFetchStatus = (store) => store.comments.fetchStatus;
  const getCommentsAsObjects  = (store) => store.comments.fetched;

  const getComments = createSelector(
    getCommentsAsObjects,

    (commentsObj) => {
      console.log('commentsObj', commentsObj)
      return (
        Object.keys(commentsObj)
        .reduce((acc, commentId) => {
          return acc.concat([commentsObj[commentId]]);
         }, [])
        .filter((comment) => !comment.deleted && !comment.parentDeleted)
      );
    }
  );

  export const getSortedComments = createSelector(
    getComments,

    (comments) => {
      return (
          // most recently edited/added to the top/start of the list
        comments.sort((commentA, commentB) => {
          if (commentA === commentB) return 0;
          if (commentA.timestamp < commentB.timestamp) return 1;
          return -1;
        })
      );
    }
  );
