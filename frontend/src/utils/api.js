const api = "http://localhost:3001"

let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Content-Type': 'application/json',  // for server
  'Authorization': token,
  'Accept': 'application/json',  // for response!
}

export const fetchCategories = () => {
  console.log('.. in fetchCategories API');

  fetch(`${api}/categories`, { headers })
  .then((res) => res.json())
  .then((data) => data.categories);
}

export const fetchPosts = () => {
  console.log('++ in fetchPosts API');

  fetch(`${api}/posts`, { headers })
  .then((res) => {
    console.log('++ got response from fetchPosts API, res:', res);
    return res.json();
  })
  .then((data) => {
     console.log('++ leaving fetchPosts API, posts data :', data);
     return data;
  })
}
