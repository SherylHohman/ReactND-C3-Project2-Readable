import * as ReaderAPI from '../../utils/api';
import * as commentActionTypes from './constants';

import { combineReducers } from 'redux';

// ACTION TYPES

const {
  GET_COMMENTS,
  REQUEST_COMMENTS,         FETCH_COMMENTS_SUCCESS,  FETCH_COMMENTS_FAILURE,
  REQUEST_ADD_COMMENT,         ADD_COMMENT_SUCCESS,     ADD_COMMENT_FAILURE,
  REQUEST_EDIT_COMMENT,       EDIT_COMMENT_SUCCESS,    EDIT_COMMENT_FAILURE,
  REQUEST_DELETE_COMMENT,   DELETE_COMMENT_SUCCESS,  DELETE_COMMENT_FAILURE,
  REQUEST_VOTE_ON_COMMENT, VOTE_ON_COMMENT_SUCCESS, VOTE_ON_COMMENT_FAILURE,
} = commentActionTypes;


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

  function fetched(state={}, action) {

    switch (action.type){

      case REQUEST_COMMENTS:
      case REQUEST_ADD_COMMENT:
      case REQUEST_EDIT_COMMENT:
      case REQUEST_DELETE_COMMENT:
      case REQUEST_VOTE_ON_COMMENT:
        // TODO: loading spinner on
        // TODO: loading spinner off on SUCCESS and FAILURE
        return state;

      // TODO: turn loading spinnera off
      case FETCH_COMMENTS_SUCCESS:
        return ({
          // ...state,  // this would ADD new comments. I want to REPLACE
          ...action.comments,
        });
      case ADD_COMMENT_SUCCESS:
        return ({
          ...state,
          [action.comment.id]: {
            ...action.comment,
          }
        });
      case EDIT_COMMENT_SUCCESS:
        return ({
          ...state,
          [action.comment.id]: {
            ...action.comment,
          }
        });
      case DELETE_COMMENT_SUCCESS:
        // needs the comment ID
        let newState = {...state};
        delete newState[action.commentId]
        return newState;

      case VOTE_ON_COMMENT_SUCCESS:
        // needs the comment ID
        return ({
          ...state,
          [action.commentId]:{
            ...state[action.commentId],
            voteScore: action.voteScore,
          }
        });

      case ADD_COMMENT_FAILURE:
      case FETCH_COMMENTS_FAILURE:
      case EDIT_COMMENT_FAILURE:
      case DELETE_COMMENT_FAILURE:
      case VOTE_ON_COMMENT_FAILURE:
        // TODO: UI error message
        // TODO: loading spinner off
        return state;

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

    switch (action.type){

      case REQUEST_COMMENTS:
      case REQUEST_ADD_COMMENT:
      case REQUEST_EDIT_COMMENT:
      case REQUEST_DELETE_COMMENT:
      case REQUEST_VOTE_ON_COMMENT:
        return ({
          ...state,
          isLoading: true,
          isFetchFailure: false,
          errorMessage: '',
        })

      // TODO: turn loading spinnera off
      case FETCH_COMMENTS_SUCCESS:
      case ADD_COMMENT_SUCCESS:
      case EDIT_COMMENT_SUCCESS:
      case DELETE_COMMENT_SUCCESS:
      case VOTE_ON_COMMENT_SUCCESS:
        return ({
          ...state,
          isLoading: false,
          isFetchFailure: false,
          errorMessage: '',
         });

      case FETCH_COMMENTS_FAILURE:
      case ADD_COMMENT_FAILURE:
      case EDIT_COMMENT_FAILURE:
      case DELETE_COMMENT_FAILURE:
      case VOTE_ON_COMMENT_FAILURE:
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

const comments = combineReducers({
  fetched,
  fetchStatus,
});

export default comments
