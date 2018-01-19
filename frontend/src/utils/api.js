const AUTH_HEADER = {'Authorization': 'sheryl-readable-authorization'};
// const AUTH_HEADER = 'sheryl-readable-authorization';

// export function fetchRecipes (food = '') {
//   food = food.trim()

//   return fetch(`https://api.edamam.com/search?q=${food}&app_id=${API_ID}&app_key=${APP_KEY}`)
//     .then((res) => res.json())
//     .then(({ hits }) => hits.map(({ recipe }) => recipe))
// }
let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

const api = "http://localhost:3001"
const route = '/categories';
const url = api + route;

export const fetchCategories = () =>
fetch(`${api}/categories`, { headers })
.then((res) => {
    return res.json()
})
.then((data) => {
   console.log('data.categoties', data.categoties);
   return data.categories;
});


// export const fetchCategories = () => {
//   // console.log('in fetchCategories');
//   const url = '/categories';
//   // return (
//     fetch(url, {
//       headers,
//       // method: 'GET',
//     })
//     .then((response) => {
//       // console.log('got response..\n', response);
//       console.log('got response..\n', response.json());
//       return response.json()
//     })
//     .then(data => data.categories)
// }

export const fetchPosts = () => {
  // console.log('in fetchPosts');
  // const url = '/posts';
  // return (
  //   fetch(url, {headers: AUTH_HEADER})
  //   .then((response) => {
  //     console.log('got response..\n', response);
  //     return response.json()})
  // );
}
