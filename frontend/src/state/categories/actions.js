export const GET_CATEGORIES = 'GET_CATEGORIES';
export const SET_CURRENT_CATEGORY = 'SET_CURRENT_CATEGORY';

export function getCategories({ categories=[] }){
  return({
    type: GET_CATEGORIES,
    categories
  });
}

export function setCurrentCategory({ selectedCategory=null }) {
  return({
    type: SET_CURRENT_CATEGORY,
      selectedCategory
    });
}
