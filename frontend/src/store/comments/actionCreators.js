import * as ReaderAPI from '../../utils/api';
import * as commentActionTypes from './constants';

// ACTION TYPES

const {
  REQUEST_COMMENTS,         FETCH_COMMENTS_SUCCESS,  FETCH_COMMENTS_FAILURE,
  REQUEST_ADD_COMMENT,         ADD_COMMENT_SUCCESS,     ADD_COMMENT_FAILURE,
  REQUEST_EDIT_COMMENT,       EDIT_COMMENT_SUCCESS,    EDIT_COMMENT_FAILURE,
  REQUEST_DELETE_COMMENT,   DELETE_COMMENT_SUCCESS,  DELETE_COMMENT_FAILURE,
  REQUEST_VOTE_ON_COMMENT, VOTE_ON_COMMENT_SUCCESS, VOTE_ON_COMMENT_FAILURE,
} = commentActionTypes;

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

  export function editComment({ id, body, author, timestamp }){
    return (dispatch) => {

      dispatch({
        type: REQUEST_EDIT_COMMENT,
        id,
        body,
        author,
        timestamp,
      });

      ReaderAPI.editComment(id, { body, timestamp, author })
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
            comment: {
              ...data
            }
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
