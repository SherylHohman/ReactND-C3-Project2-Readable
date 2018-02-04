import * as ReaderAPI from '../utils/api';

// ACTION TYPES
  export const REQUEST_COMMENTS = 'REQUEST_COMMENTS';
  export const FETCH_COMMENTS_SUCCESS = 'FETCH_COMMENTS_SUCCESS';
  export const FETCH_COMMENTS_FAILURE = 'FETCH_COMMENTS_FAILURE';

  export const ADD_COMMENT = 'ADD_COMMENT';
  export const EDIT_COMMENT = 'EDIT_COMMENT';
  export const DELETE_COMMENT = 'DELETE_COMMENT';
  export const GET_COMMENTS = 'GET_COMMENTS';

  export const REQUEST_VOTE_ON_COMMENT = 'REQUEST_VOTE_ON_COMMENT';
  export const VOTE_ON_COMMENT_SUCCESS = 'VOTE_ON_COMMENT_SUCCESS';
  export const VOTE_ON_COMMENT_FAILURE = 'VOTE_ON_COMMENT_FAILURE';


// FAT ACTION CREATORS

  export function fetchComments(postId){
    return (dispatch) => {

      dispatch({
        type: REQUEST_COMMENTS,
      });

      ReaderAPI.fetchComments(postId)
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, fetchComments');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {

          // transform array to object
          const commentsAsObjects = data.reduce((acc, commentData)=>{
            return {
              ...acc,
              [commentData.id]: commentData,
            }
          }, {})

          return (
            dispatch({
              type: FETCH_COMMENTS_SUCCESS,
              comments: commentsAsObjects,
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: FETCH_COMMENTS_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };

  export function editComment({ id, title, body }){
    return ({
      type: EDIT_COMMENT,
      id,
      // these are the items that can be edited
      title,
      body,
      // may also need to pass in all info off the object, so can populate
      // the 'edit' dialog box ? OR only show (an prepopulate) the values
      // that can be edited by the user?
      // on that note: datetime stays as Orig time, nor Edit time, right?
    });
  };

  export function deleteComment(id){
    // just needs a commentID, or the wholeComment object?
    return ({
      type: DELETE_COMMENT,
      id,
    });
    // (set in DB and state)
    // doesn't actually DELETE comment from database
    // it sets it's and it's "deletedComment" flag to True, hence it won't be returned by an SPI query ?
    //  OR, I need to check the returned Query, and Only Display comments where its "deletedComment" AND its  "deletedPost" flags are both false.
    //
  };

  function voteOnComment(commentId, vote){
    return (dispatch) => {

      dispatch({
        type: REQUEST_VOTE_ON_COMMENT
      });

      ReaderAPI.voteOnComment(commentId, vote)
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, voteOnComment');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {

          // data is the full (updated) comment object.
          return (
            dispatch({
              type: VOTE_ON_COMMENT_SUCCESS,
              commentId: data.id,
              voteScore: data.voteScore,
            })
          )}
        )

        .catch(err => {
          console.log('(catch) error voting on comment, err:', err);
          console.error(err);  //  in case of render error
          dispatch({
            type: VOTE_ON_COMMENT_FAILURE,
            err,
            error: true,
          })
        });
    };  // anon function(dispatch) wrapper
  };
  export function upVoteComment(id){
    return (dispatch) => {
      dispatch(voteOnComment(id, ReaderAPI.upVote))
    };
  };
  export function downVoteComment(id){
    return (dispatch) => {
      dispatch(voteOnComment(id, ReaderAPI.downVote))
    };
  };

// SAMPLE DATA
  // const sampleComment = {
  //     id: '894tuq4ut84ut8v4t8wun89g',
  //     parentId: "8xf0y6ziyjabvozdd253nd",
  //     timestamp: 1468166872634,
  //     body: 'Hi there! I am a COMMENT.',
  //     author: 'thingtwo',
  //     voteScore: 6,
  //     deleted: false,
  //     parentDeleted: false
  //   }

  // const sampleComments = {
  //   "894tuq4ut84ut8v4t8wun89g": { ...sampleComment },
  //   // "andAnother [id] string": {..anotherSampleComment},
  //   // etc
  // };

  // store element is sampleComments
  //    aka an object of comment objects, where property name for each (comment object) is the id for that comment.

  // state (inside the components) would be transformed into an array of sampleComment items


// REDUCERs

  function comments(state={}, action) {

    const { id } = action

    switch (action.type){
      case REQUEST_COMMENTS:
        // TODO set loading spinner on
        return state;
      case FETCH_COMMENTS_SUCCESS:
        return ({
          ...state,
          ...action.comments,
          // TODO: turn loading spinner off
        });
      case FETCH_COMMENTS_FAILURE:
          // TODO: UI error message
          return state;

      case ADD_COMMENT:
        return ({
          ...state,
          [action.comment]: {
            id,
            parentId: action.parentId,
            timestamp: action.timestamp,
            body: action.body,
            author: action.author,
            voteScore: 1,
            deleted: false,
            parentDeleted: false,
          }
        });
      case EDIT_COMMENT:
        return ({
          ...state,
           [id]: {
            ...[id],
            // do I keep the original comment time, or update to time of latest edit ?
            // timestamp: action.timestamp,
            body: action.body,
            title: action.title,
           }
        });
      case DELETE_COMMENT:
        // needs the comment ID
        return ({
          ...state,
          [id]: {
            ...state[id],
            deleted: true,
          }
        });

      case REQUEST_VOTE_ON_COMMENT:
        // TODO: do I need a spinner ?
        return state;
      case VOTE_ON_COMMENT_SUCCESS:
        // needs the comment ID
        return ({
          ...state,
          [action.commentId]:{
            ...state[action.commentId],
            voteScore: action.voteScore,
          }
        });
      case VOTE_ON_COMMENT_FAILURE:
        // TODO: error message
        return state;

      default:
        return state;
    }
  }

export default comments
