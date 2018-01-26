const api = "http://localhost:3001"

let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Content-Type': 'application/json',  // for server
  'Authorization': token,
  'Accept': 'application/json',  // for response!
}

// export const fetchCategoriesAPI = () => {
//   console.log('.. in fetchCategories API');

//   fetch(`${api}/categories`, { headers })
//   .then((res) => res.json())
//   .then((data) => data.categories);
// }

export const fetchCategoriesAPI = () => {
  return fetch(`${api}/categories`, { headers })
}

// export const fetchPosts = () => {
//   console.log('++ in fetchPosts API');

//   fetch(`${api}/posts`, { headers })
//   .then((res) => {
//     console.log('++ got response from server, res:', res);
//     return res.json();
//   })
//   .then((data) => {
//      console.log('++ leaving fetchPosts API, posts data :', data);
//      return data;
//   })
// }

export const fetchPosts = () => {
  // console.log('++ in fetchPosts API');
  return fetch(`${api}/posts`, { headers })
}


// Business logic of handling the response is now in the actionCreator.
//  Not sure I'm happy with it there, but it works Now!!
// thing is that since all the "thenning" was happened here,
// "cannot then on undefined" or something ike that
// -- there were no more "then"s to be had.
// Can "then" HERE or THERE. Not both.  Not Even *1* of them!
// *EITHER RETURN, OR  THEN*
