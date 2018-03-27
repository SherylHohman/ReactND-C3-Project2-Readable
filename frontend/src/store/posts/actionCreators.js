import * as ReaderAPI from '../../utils/api';
import { ADD_COMMENT_SUCCESS, DELETE_COMMENT_SUCCESS } from '../comments/constants';
import { getLoc } from '../viewData/selectors';

// Action Types
import * as postActionTypes from './constants';

// ACTION TYPES
const {
        REQUEST_POSTS,         FETCH_POSTS_SUCCESS,   FETCH_POSTS_FAILURE,
        REQUEST_POST,           FETCH_POST_SUCCESS,    FETCH_POST_FAILURE,
        REQUEST_ADD_POST,         ADD_POST_SUCCESS,      ADD_POST_FAILURE,
        REQUEST_EDIT_POST,       EDIT_POST_SUCCESS,     EDIT_POST_FAILURE,
        REQUEST_DELETE_POST,   DELETE_POST_SUCCESS,   DELETE_POST_FAILURE,
        REQUEST_VOTE_ON_POST, VOTE_ON_POST_SUCCESS,  VOTE_ON_POST_FAILURE,
      } = postActionTypes;


// THUNK ACTION CREATORS

  export function fetchPosts(category=null){
    //  fetch ALL posts:   fetchPosts(), or fetchPosts(null)
    //  fetch by category: fetchPosts(category.path)
    return (dispatch) => {

      dispatch({
        type: REQUEST_POSTS
      });

      ReaderAPI.fetchPosts(category)
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, fetchPosts');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {

          // Turn array into Object
          const postsAsObjects = data.reduce((acc, postData)=>{
            return {
              ...acc,
              [postData.id]: postData,
            }
          }, {})

          return (
            dispatch({
              type: FETCH_POSTS_SUCCESS,
              posts: postsAsObjects,
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: FETCH_POSTS_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };

  export function fetchPost(postId){
    return (dispatch) => {

      dispatch({
        type: REQUEST_POST
      });

      ReaderAPI.fetchPost(postId)
        .then((response) => {
          if (!response.ok) {
            console.log('posts.fetchPost __response NOT OK, fetchPosts', response.ok, response.statusText);
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((post) => {
          return (
            dispatch({
              type: FETCH_POST_SUCCESS,
              post,
            })
          )}
        )

        .catch(err => {
          console.log('posts.fetchPost .catch, ERR:', err);
          console.error(err);  //  in case of render error
          dispatch({
            type: FETCH_POST_FAILURE,
            err,
            error: true,
          })
        })

    };  // anon function(dispatch) wrapper
  };

  export function addPost(newPostData){
    // newPostData does not contain fields that are initialized by the server
    return (dispatch) => {

      dispatch({
        type: REQUEST_ADD_POST
      });

      ReaderAPI.addPost(newPostData)
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, addPost');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {
          // data is the full post

          return (
            dispatch({
              type: ADD_POST_SUCCESS,
              post: data,
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: ADD_POST_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };

  export function editPost(postId, editedPostData){
    return (dispatch) => {

      dispatch({
        type: REQUEST_EDIT_POST
      });

      ReaderAPI.editPost(postId, editedPostData)
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, editPost');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {
          // data is the full (updated) post object.

          return (
            dispatch({
              type: EDIT_POST_SUCCESS,
              post: data,
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: EDIT_POST_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };

  export function deletePost(id){
    return (dispatch) => {

      dispatch({
        type: REQUEST_DELETE_POST
      });

      ReaderAPI.deletePost(id)
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, deletePost');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {
          if (data.deleted !== true) {
            throw Error('Post wasn\'t deleted, postId: ' + data.id);
          }
          return (
            dispatch({
              type: DELETE_POST_SUCCESS,
              id: data.id,
              // deleted: data.deleted,
              categoryName: data.category,
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: DELETE_POST_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };

 function voteOnPost(postId, vote){
    return (dispatch) => {
      dispatch({
        type: REQUEST_VOTE_ON_POST
      });

      ReaderAPI.voteOnPost(postId, vote)
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, received in voteOnPost');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {

          // data is the full (updated) post object.
          return (
            dispatch({
              type: VOTE_ON_POST_SUCCESS,
              postId: data.id,
              voteScore: data.voteScore,
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: VOTE_ON_POST_FAILURE,
            err,
            error: true,
          })
        });
    };  // anon function(dispatch) wrapper
  };
  export function upVotePost(id){
    return (dispatch) => {
      dispatch(voteOnPost(id, ReaderAPI.upVote));
    }
  };
  export function downVotePost(id){
    return (dispatch) => {
      dispatch(voteOnPost(id, ReaderAPI.downVote));
    }
  };
