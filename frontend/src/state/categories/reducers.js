import * as ReaderAPI from '../../utils/api';

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
  export function fetchCategories(dispatch){
    dispatch({
      type: FETCH_CATEGORIES,
    });
    console.log('dispatched FETCH_CATEGORIES from fetchCategories reducer');

    ReaderAPI.fetchCategories()
      .then(categories =>
        dispatch({
          type: FETCH_CATEGORIES_SUCCESS,
          categories,
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
  };


// ACTION CREATORS
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

// REDUCER(s)
  function category(state=sampleData, action){
    switch (action.type){
      case FETCH_CATEGORIES_SUCCESS:
        // update state with list of category names
        return ({
          ...state,
          categories: action.categories
        });
      case FETCH_CATEGORIES:
        return ({
          ...state,
          //  could set an loading (boolean flag) to some state that would show a loading message
        });
      case FETCH_CATEGORIES_FAILURE:
        return ({
          ...state,
          //  could set an error message on some state to handle errors
        });
      case SET_CURRENT_CATEGORY:
        return({
          ...state,
          // selectedCategory: action.selectedCategory,
        });
      default:
        return state;
    }
  }

export default category;

