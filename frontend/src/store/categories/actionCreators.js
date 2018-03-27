import * as ReaderAPI from '../../utils/api';

// Action Types
import * as categories_ActionTypes from './constants';

// ACTION TYPES

 const {
         FETCH_CATEGORIES, FETCH_CATEGORIES_SUCCESS, FETCH_CATEGORIES_FAILURE
       } = categories_ActionTypes;


 // THUNK ACTION CREATORS

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
