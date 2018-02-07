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
                [category.name]: category,
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

      // DELETE_POST_SUCCESS - see Notes below

      default:
        return state;
    }
  }

export default categories;


    // Notes: DELETE_POST_SUCCESS
      // consider reacting to case DELETE_POST_SUCCESS
      // would not directly alter state from here.
      // instead, I'd dispatch an action.  From here, I have access to the
      // categories array.  and from DELE.. I have access to the post.categoryName
      // .. from those two, I can access categoryPath. Which is what changeView
      // needs, if it were to update the url, to redirect to the categories page
      // that the previous post belonged to (as opposed to returning to all posts page.)
      // Currently, I'm instead calling changeView directly from the Post component.
      // But setting the url from there *may* be a bit low level ?? Plus, I don't
      // want to redirect until AFTER I have confirmation from the server of SUCCESS.
      // Two ways I could dispatch from here: resend DELE.. but with the
      // datafields of categoryPath, categoryName. Or call changeView. I think
      // re-dispatching with the new data is better.
      // Then again, this whole process seems too convoluted.
      // Probably better just call 2 functions, that each dispatch actions is better.
      // Or have another middle man function, that handles common action-combination
      // patterns.
