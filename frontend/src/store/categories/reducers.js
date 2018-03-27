import { combineReducers } from 'redux';
import * as actionTypes from './constants';

// ACTION TYPES
  const { FETCH_CATEGORIES,
          FETCH_CATEGORIES_SUCCESS,
          FETCH_CATEGORIES_FAILURE } = actionTypes;


// INITIAL STATES
  const categoriesInitialState = {};

  const fetchStatusInitialState = {
    isLoading: false,
    isFetchFailure: false,
    errorMessage: '',
  }

// REDUCERS

  function fetched(state=categoriesInitialState, action){
    switch (action.type){
      case FETCH_CATEGORIES_SUCCESS:
        console.log('fetched categories to store, categories', action.categories);
        return ({
          ...state,
          ...action.categories
        });
      case FETCH_CATEGORIES:
      case FETCH_CATEGORIES_FAILURE:
        return ({
          ...state,
        });

      default:
        return state;
    }
  }

function fetchStatus(state=fetchStatusInitialState, action){
  switch (action.type){
    case FETCH_CATEGORIES:
      return ({
        ...state,
        isLoading:      true,
        isFetchFailure: false,
        errorMessage:   '',
      });
    case FETCH_CATEGORIES_SUCCESS:
      console.log('fetched categories to store, fetchStatus, spinner off', action.categories);
      return ({
        ...state,
        isLoading:      false,
        isFetchFailure: false,
        errorMessage:   '',
      });
    case FETCH_CATEGORIES_FAILURE:
      return ({
        ...state,
        isLoading:      false,
        isFetchFailure: true,
        errorMessage:   action.err,
      });
    default:
      return state;
  }
}
const categories = combineReducers({
  fetched,
  fetchStatus,
});
export default categories
