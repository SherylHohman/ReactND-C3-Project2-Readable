// ACTION TYPES
  export const GET_CATEGORIES = 'GET_CATEGORIES';
  export const SET_CURRENT_CATEGORY = 'SET_CURRENT_CATEGORY';

// ACTION CREATORS
  export function getCategories({ categories={} }){
    return({
      type: GET_CATEGORIES,
      categories,
    });
  }

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
      case GET_CATEGORIES:
        return ({
          ...state,
          categories: action.categories
        });
      case SET_CURRENT_CATEGORY:
        return({
          ...state,
          selectedCategory: action.selectedCategory,
        });
      default:
        return state;
    }
  }

export default category;



/* TODO: ?
  To avoid falling into the "getters" setters" way of thinking,
  - Perhaps rename getCategories, to fetchCategories,
   indicating that we are calling an API ??
  - Perhaps setCurrentCategory might be selectedCategory ??
  Resolve this same paradigm for comments, posts, (user), etc., if necessary.
*/

