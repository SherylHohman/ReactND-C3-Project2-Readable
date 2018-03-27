import * as ReaderAPI from '../../utils/api';
import * as actionTypes from './constants';
import { HOME } from '../viewData/constants';
import { combineReducers } from 'redux';

// ACTION TYPES

  const { FETCH_CATEGORIES,
          FETCH_CATEGORIES_SUCCESS,
          FETCH_CATEGORIES_FAILURE } = actionTypes;

// ACTION CREATORS

  export function fetchCategories(){
    return (dispatch) => {

      dispatch({ type: FETCH_CATEGORIES });
        // TODO: show loading spinner

        ReaderAPI.fetchCategories()
          .then((response) => {

            if (!response.ok) {
              console.log('__response NOT OK, fetchCategories');
              throw Error(response.statusText);
            }
            return response;

          })
          .then((response) => response.json())
          .then((data) => {
            console.log('categories.actionCreators, fetched categories:', data);
            // data.categories is array of category objects {name, url}
            const categoriesObject = data.categories.reduce((acc, category)=>{
              return {
                ...acc,
                // key should use its path !!!, not its name
                [category.path]: category,
              }
            }, {})

            return dispatch({
              type: FETCH_CATEGORIES_SUCCESS,
              categories: categoriesObject,
            })}
          )
          .catch(err => {
            console.error(err);  //  in case of render error
            dispatch({
              type: FETCH_CATEGORIES_FAILURE,
              err,
              error: true,
            })
          });

    }; // dispatch wrapper
};


// // INITIAL STATES
//   const categoriesInitialState = {};

//   const fetchStatusInitialState = {
//     isLoading: false,
//     isFetchFailure: false,
//     errorMessage: '',
//   }
