import * as ReaderAPI from '../utils/api';

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

  export function fetchCategories(){
    return (dispatch) => {

      dispatch({ type: FETCH_CATEGORIES });
      // TODO: show loading spinner

        ReaderAPI.fetchCategories()
        // fetchCategoriesAPI()
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
          .then((data) => {
            // data.categories is array of category objects {name, url}
            const categoriesObject = data.categories.reduce((acc, category)=>{
              return {
                ...acc,
                // index categories on the path !!!, not the name
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


// INITIAL STATES
  const categoriesInitialState = {};


// REDUCER(s)
  function categories(state=categoriesInitialState, action){
    switch (action.type){
      case FETCH_CATEGORIES_SUCCESS:
        return ({
          ...state,
          ...action.categories
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

export default categories;
