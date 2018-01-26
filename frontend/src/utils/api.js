const api = "http://localhost:3001"

let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Content-Type': 'application/json',  // for server
  'Authorization': token,
  'Accept': 'application/json',  // for response!
}

export const fetchCategoriesAPI = () => {
  return fetch(`${api}/categories`, { method: 'GET', headers })
}

export const fetchPosts = () => {
  return fetch(`${api}/posts`, { method: 'GET', headers })
}

export const fetchCommentsAPI = (postId) => {
  return fetch(`${api}/posts/${postId}/comments`, {
    method: 'GET',
    headers
  })
}


// Business logic of handling the response is now in the actionCreator.
//  Not sure I'm happy with it there, but it works Now!!
// thing is that since all the "thenning" was happened here,
// "cannot then on undefined" or something ike that
// -- there were no more "then"s to be had.
// Can "then" HERE or THERE. Not both.  Not Even *1* of them!
// *EITHER RETURN, OR  THEN*
