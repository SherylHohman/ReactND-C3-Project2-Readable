import * as ReaderAPI from '../utils/api';
import { ADD_COMMENT_SUCCESS, DELETE_COMMENT_SUCCESS } from './comments';

// ACTION TYPES
  export const REQUEST_POSTS = 'REQUEST_POSTS';
  const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
  const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';

  export const REQUEST_POST = 'REQUEST_POST';
  const FETCH_POST_SUCCESS = 'FETCH_POST_SUCCESS';
  const FETCH_POST_FAILURE = 'FETCH_POST_FAILURE';

  export const REQUEST_ADD_POST = 'REQUEST_ADD_POST';
   const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
   const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

  export const REQUEST_EDIT_POST = 'REQUEST_EDIT_POST';
   const EDIT_POST_SUCCESS = 'EDIT_POST_SUCCESS';
   const EDIT_POST_FAILURE = 'EDIT_POST_FAILURE';

  export const REQUEST_DELETE_POST = 'REQUEST_DELETE_POST';
  export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
   const DELETE_POST_FAILURE = 'DELETE_POST_FAILURE';

  export const REQUEST_VOTE_ON_POST = 'REQUEST_VOTE_ON_POST';
   const VOTE_ON_POST_FAILURE = 'VOTE_ON_POST_FAILURE';
   const VOTE_ON_POST_SUCCESS = 'VOTE_ON_POST_SUCCESS';


// FAT ACTION CREATORS

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
            console.log('__response NOT OK, fetchPosts');
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
          }));
        })

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: FETCH_POST_FAILURE,
            err,
            error: true,
          })
        });

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


// INITIAL STATE
  const postsInitialState = {
    isLoading: false,
    isFetchFailure: false,
    errorMessage: '',
  }

// SAMPLE DATA
  // const samplePost = {
  //     id: '8xf0y6ziyjabvozdd253nd',
  //     timestamp: 1467166872634,
  //     title: 'Udacity is the best place to learn React',
  //     body: 'Everyone says so after all.',
  //     author: 'thingtwo',
  //     category: 'react',
  //     voteScore: 6,
  //     deleted: false,
  //     commentCount: 2
  //   }

  // const samplePosts = {
  //   ...postsInitialState,
  //   "8xf0y6ziyjabvozdd253nd": { ...samplePost },
  // };


// REDUCERS

  // state is an object of (multiple) post objects
  function posts(state=postsInitialState, action) {

    // TODO: refactor. combine cases.
    switch (action.type){

      case REQUEST_POSTS:
      case REQUEST_ADD_POST:
      case REQUEST_EDIT_POST:
      case REQUEST_DELETE_POST:
      case REQUEST_VOTE_ON_POST:
        // TODO set loading spinner on
        return state;

      case FETCH_POSTS_SUCCESS:
        // fetch All Posts, AND
        // fetch Posts by Category
        return ({
          // TODO: turn loading spinner off
          // REPLACES all posts in store with current fetched results
          ...action.posts,
        });

      case REQUEST_POST:
        // TODO set loading spinner on
        return ({
          ...state,
          isLoading: true,
          isFetchFailure: false,
          errorMessage: '',
        })
      case FETCH_POST_SUCCESS:
        return ({
          ...state,
          [action.post.id]: action.post,
          isLoading: false,
          isFetchFailure: false,
          errorMessage: '',
         });
      case FETCH_POST_FAILURE:
        return ({
          ...state,
          isLoading: false,
          isFetchFailure: true,
          errorMessage: action.err,
        })

      case ADD_POST_SUCCESS:
        return ({
          ...state,
          // adds a new id and object to the posts object (quasi-list)
          [action.post.id]: {
            ...action.post,
          },
        });
      case EDIT_POST_SUCCESS:
        return ({
          ...state,
           [action.post.id]: {
            ...action.post,
           }
        });
      case DELETE_POST_SUCCESS:
        let newState = {...state};
        delete newState[action.id]
        return newState;

      case VOTE_ON_POST_SUCCESS:
        return ({
          ...state,
          [action.postId]: {
            ...state[action.postId],
            voteScore: action.voteScore,
          }
        });

      // update commentCount on Posts
      case ADD_COMMENT_SUCCESS:
        return ({
          ...state,
          [action.postId]: {
            ...state[action.postId],
            commentCount: state[action.postId].commentCount + 1,
          }
        });
      case DELETE_COMMENT_SUCCESS:
        return ({
          ...state,
          [action.postId]: {
            ...state[action.postId],
            commentCount: state[action.postId].commentCount - 1,
          }
        });

      case FETCH_POSTS_FAILURE:
      case ADD_POST_FAILURE:
      case EDIT_POST_FAILURE:
      case DELETE_POST_FAILURE:
      case VOTE_ON_POST_FAILURE:
        // TODO: UI error message
        // TODO: set loading spinner off
        return state;

      default:
        return state;
    }
  }


export default posts
