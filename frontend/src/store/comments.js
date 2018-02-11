import * as ReaderAPI from '../utils/api';

// ACTION TYPES
  export const REQUEST_COMMENTS = 'REQUEST_COMMENTS';
   const FETCH_COMMENTS_SUCCESS = 'FETCH_COMMENTS_SUCCESS';
   const FETCH_COMMENTS_FAILURE = 'FETCH_COMMENTS_FAILURE';

  export const REQUEST_ADD_COMMENT = 'REQUEST_ADD_COMMENT';
  export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
  const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

  export const REQUEST_EDIT_COMMENT = 'REQUEST_EDIT_COMMENT';
  const EDIT_COMMENT_SUCCESS = 'EDIT_COMMENT_SUCCESS';
  const EDIT_COMMENT_FAILURE = 'EDIT_COMMENT_FAILURE';

  export const REQUEST_DELETE_COMMENT = 'REQUEST_DELETE_COMMENT';
  export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS';
  const DELETE_COMMENT_FAILURE = 'DELETE_COMMENT_FAILURE';

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

  export function addComment(newCommentData){
    // newCommenData does not contain fields that are initialized by the server
    return (dispatch) => {

      dispatch({
        type: REQUEST_ADD_COMMENT
      });

      ReaderAPI.addComment(newCommentData)
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, addComment');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {
          // data is the full comment

          return (
            dispatch({
              type: ADD_COMMENT_SUCCESS,
              comment: data,
              postId: data.parentId,  // increment commentCounter on Post object
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: ADD_COMMENT_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };

  export function editComment({ id, body, timestamp }){
    return (dispatch) => {

      dispatch({
        type: REQUEST_EDIT_COMMENT,
        id,
        body,
        timestamp,
      });

      ReaderAPI.editComment(id, { body, timestamp })
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, Edit Comment');
            throw Error(response.statusText);
          }
          return response;
        })
        .then(response => response.json())
        .then(data => {
          dispatch({
            type: EDIT_COMMENT_SUCCESS,
            id: data.id,
            body: data.body,
            timestamp: data.timestamp,
          })
        })
        .catch(err => {
          dispatch({
            type: EDIT_COMMENT_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };


  export function deleteComment(commentId){
    // just needs a commentID, or the wholeComment object?
    return (dispatch) => {

      dispatch({
        type: REQUEST_DELETE_COMMENT
      });

      ReaderAPI.deleteComment(commentId)
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, Delete Comment');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {
          // data is the full comment

          if (data.deleted === true){
            return (
              dispatch({
                type: DELETE_COMMENT_SUCCESS,
                commentId: data.id,
                postId:    data.parentId,  // to update commentCount on Post object
              })
            );
          }
          else {
            console.log('comment returned as deleted: false');
            throw Error('comment returned as deleted: false');
          }
        })

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: DELETE_COMMENT_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
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

      case REQUEST_ADD_COMMENT:
        // TODO:
        return state;
      case ADD_COMMENT_SUCCESS:
        return ({
          ...state,
          [action.comment.id]: {
            ...action.comment,
          }
        });
      case ADD_COMMENT_FAILURE:
        // TODO: UI error message
        return state;

      case REQUEST_EDIT_COMMENT:
        // TODO:
        return state;
      case EDIT_COMMENT_SUCCESS:
        return ({
          ...state,
          [action.id]: {
            ...state[action.id],
            body: action.body,
            timestamp: action.timestamp,
          }
        });
      case EDIT_COMMENT_FAILURE:
        // TODO: UI error message
        return state;

      case REQUEST_DELETE_COMMENT:
        // TODO
        return state;
      case DELETE_COMMENT_SUCCESS:
        // needs the comment ID
        let newState = {...state};
        delete newState[action.commentId]
        return newState;
      case DELETE_COMMENT_FAILURE:
        // TODO
        return state;

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
