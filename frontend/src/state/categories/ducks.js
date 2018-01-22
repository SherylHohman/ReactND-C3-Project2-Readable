// import { combineReducers } from "redux";
// import * as ReaderAPI from '../../utils/api';
import { fetchCategoriesAPI } from '../../utils/api';

// ACTION TYPES
  export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
  export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
  export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';
  export const SET_CURRENT_CATEGORY = 'SET_CURRENT_CATEGORY';

// THUNK ACTION CREATORS (allows side effects: api calls)
  //  library automatically calls the returned functions with
  //    dispatch as the 1st argument (saves typing)
  //  automatically 'getState' is automatically passed into these
  //    (thunk action creators)
  //    as a 2nd param, so state is automatically available inside
  //    thunk action creators.
  //

// FAT ACTION CREATORS (business logic, then call dispatch on results)
  //  downside: no access to global state.
  //  So if global state is needed to make business logic decision with,
  //  it needs to be passed through components (including intermediary
  //    components)
  //  in that case: refactor to use redux-thunks instead (THUNK ACTION CREATOR)

// const requestCategories = () => ({ type: REQUEST_CATEGORIES })
// // issue #1
// export function fetchCategories() {
//   return function (dispatch) {
//   // issue #2
//     dispatch(requestCategories)
//   ...
//   };
// };

  // const requestCategories = () => ({
  //   type: REQUEST_CATEGORIES
  // })
  // const requestCategories_fail = () => ({
  //   type: REQUEST_CATEGORIES_SUCCESS
  // })
  // const requestCategories_success = () => ({
  //   type: REQUEST_CATEGORIES_FAIL,
  //   categories
  // })

  export function fetchCategories(dispatch){
    return (dispatch) => {

      dispatch({ type: FETCH_CATEGORIES });
      // TODO: show loading spinner

      // ReaderAPI.fetchCategories()
        fetchCategoriesAPI()
          .then((response) => {

            if (!response.ok) {
              console.log('__response NOT OK, fetchCategories');
              throw Error(response.statusText);
            }

            // TODO
            // dispatch({
            //   type: IS_LOADING_FALSE,
            //   showLoadingSpinner: false,
            // });

            return response;

          })
          .then((response) => response.json())
          .then((data) => dispatch({
              type: FETCH_CATEGORIES_SUCCESS,
              categories: data.categories,
            })
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


// ACTION CREATORS  (traditional)

  // export function fetchCategories({ categories={} }){
  //   return({
  //     type: FETCH_CATEGORIES,
  //     categories,
  //   });
  // }

  // export function fetchCategoriesSuccess({ categories={} }){
  //   return({
  //     type: FETCH_CATEGORIES_SUCCESS,
  //     categories,
  //   });
  // }

  export function setCurrentCategory({ selectedCategory=null }) {
    // used to filter all posts by category
    //   I don't see a need to make an API call to do this.
    //   -- unless user started on a category page instead of home page
    //    then, perhaps its quicker to do a category fetch,
    //    followed by a all/posts fetch later ??
    //    I'm not convinced, yet.
    //  Thus, I'll INSTEAD store SELECTED CATEGORY in state/store
    //    individual component can filter, just as we did in MyReads App
    return({
      type: SET_CURRENT_CATEGORY,
      selectedCategory,
      });
  }

// SAMPLE DATA
  const sampleData = {
    categories: ['redux', 'react', 'javaScript'],
    selectedCategory: null,
    // use null to display *ALL* categories
  };

// INITIAL STATES
  const categoryInitialState = {};
  const categoriesInitialState = {};

// REDUCER(s)
  function categories(state=categoriesInitialState, action){
    switch (action.type){
      case FETCH_CATEGORIES_SUCCESS:
        return ({
          ...state,
          categories: action.categories
          // TODO: turn loading spinner off
        });
      case FETCH_CATEGORIES:
        return ({
          ...state,
          //  TODO: turn loading spinner on
        });
      case FETCH_CATEGORIES_FAILURE:
        return ({
          ...state,
          // TODO: turn loading spinner off
          // TODO: could set an error message on some state to handle errors
        });

      default:
        return state;
    }
  }

  // not exported - may not use
  function category(state=categoryInitialState, action){
    switch (action.type){
      case SET_CURRENT_CATEGORY:
        return({
          ...state,
          // selectedCategory: action.selectedCategory,
        });
      default:
        return state;
    }
  }

export default categories;

// export default combineReducers( {
//     categories,
//     category,
// } );
