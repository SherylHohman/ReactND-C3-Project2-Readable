import { combineReducers } from 'redux';

// Action Types
import * as actionTypes from './constants';
import { ADD_COMMENT_SUCCESS, DELETE_COMMENT_SUCCESS } from '../comments/constants';

// ACTION TYPES
const {
        REQUEST_POSTS,         FETCH_POSTS_SUCCESS,   FETCH_POSTS_FAILURE,
        REQUEST_POST,           FETCH_POST_SUCCESS,    FETCH_POST_FAILURE,
        REQUEST_ADD_POST,         ADD_POST_SUCCESS,      ADD_POST_FAILURE,
        REQUEST_EDIT_POST,       EDIT_POST_SUCCESS,     EDIT_POST_FAILURE,
        REQUEST_DELETE_POST,   DELETE_POST_SUCCESS,   DELETE_POST_FAILURE,
        REQUEST_VOTE_ON_POST, VOTE_ON_POST_SUCCESS,  VOTE_ON_POST_FAILURE,
      } = actionTypes;

// INITIAL STATE
  const postsInitialState = {};

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
  function fetchedPosts(state=postsInitialState, action) {
    // console.log('posts.fetchedPosts reducer, state', state)
    // console.log('posts.fetchedPosts reducer, action', action)

    // TODO: refactor. combine cases.
    switch (action.type){

      case REQUEST_POST:
      case REQUEST_POSTS:
      case REQUEST_ADD_POST:
      case REQUEST_EDIT_POST:
      case REQUEST_DELETE_POST:
      case REQUEST_VOTE_ON_POST:
        return state;

      case FETCH_POSTS_SUCCESS:
        // fetch All Posts, AND
        // fetch Posts by Category
        // REPLACES all posts in store with current fetched results
        return ({
          ...action.posts,
        });

      case FETCH_POST_SUCCESS:
        return ({
          ...state,
          [action.post.id]: action.post,
         });
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

      case FETCH_POST_FAILURE:
      case FETCH_POSTS_FAILURE:
      case ADD_POST_FAILURE:
      case EDIT_POST_FAILURE:
      case DELETE_POST_FAILURE:
      case VOTE_ON_POST_FAILURE:
        return state;

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

      default:
        return state;
    }
  }

  const fetchStatusInitialState = {
    isLoading: false,
    isFetchFailure: false,
    errorMessage: '',
  }
  function fetchStatus(state=fetchStatusInitialState, action) {
    // console.log('posts.fetchStatus reducer, state', state)
    // console.log('posts.fetchStatus reducer, action', action)

    switch (action.type){

      case REQUEST_POSTS:
      case REQUEST_ADD_POST:
      case REQUEST_EDIT_POST:
      case REQUEST_DELETE_POST:
      case REQUEST_VOTE_ON_POST:
      case REQUEST_POST:
        return ({
          ...state,
          isLoading: true,
          isFetchFailure: false,
          errorMessage: '',
        })
      case FETCH_POST_SUCCESS:
      case FETCH_POSTS_SUCCESS:
      case ADD_POST_SUCCESS:
      case EDIT_POST_SUCCESS:
      case DELETE_POST_SUCCESS:
      case VOTE_ON_POST_SUCCESS:
        return ({
          ...state,
          isLoading: false,
          isFetchFailure: false,
          errorMessage: '',
         });
      case FETCH_POST_FAILURE:
      case FETCH_POSTS_FAILURE:
      case ADD_POST_FAILURE:
      case EDIT_POST_FAILURE:
      case DELETE_POST_FAILURE:
      case VOTE_ON_POST_FAILURE:
        return ({
          ...state,
          isLoading: false,
          isFetchFailure: true,
          errorMessage: action.err,
        })

      default:
        return state;
    }
  }

const posts = combineReducers({
  fetchedPosts,
  fetchStatus,
});

export default posts
