import { combineReducers } from 'redux';

// Action Types
import * as categories_ActionTypes from './constants';

// ACTION TYPES

 const {
         FETCH_CATEGORIES, FETCH_CATEGORIES_SUCCESS, FETCH_CATEGORIES_FAILURE
       } = categories_ActionTypes;


// INITIAL STATES
  const categoriesInitialState = {};

  const fetchStatusInitialState = {
    isLoading: false,
    isFetchFailure: false,
    errorMessage: '',
  }

// REDUCER(s)
  function fetched(state=categoriesInitialState, action){
    switch (action.type){
      case FETCH_CATEGORIES_SUCCESS:
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

