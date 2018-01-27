export const upVote = "upVote";
export const downVote = "downVote";

const api = "http://localhost:3001"

let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Content-Type': 'application/json',  // for server
  'Authorization': token,
  'Accept': 'application/json',  // for response!
}

//FETCHING

  // Gets all categories listed in categories.js (modify that file as desired)
  export const fetchCategoriesAPI = () => {
    return fetch(`${api}/categories`, { method: 'GET', headers })
  }

  // Gets all (ok, 10 at a time) posts
  export const fetchPosts = () => {
    return fetch(`${api}/posts`, { method: 'GET', headers })
  }
  // TODO: refactor to combine posts and postsCategory into a wrapper function
  // Gets all (ok 10) posts from specified category
  export const fetchPostsCategoryAPI = (category) => {
    return fetch(`${api}/${category}/posts`, { method: 'GET', headers })
  }

  // Gets specified post
  export const fetchPostAPI = (postId) => {
    return fetch(`${api}/posts/${postId}`, {method: 'GET', headers })
  }

  // Gets all comments associated with specified post
  export const fetchCommentsAPI = (postId) => {
    return fetch(`${api}/posts/${postId}/comments`, { method: 'GET', headers })
  }

  // Gets specified comment
  export const fetchCommentAPI = (commentId) => {
    return fetch(`${api}/comments/${commentId}`, { method: 'GET', headers })
  }

//  DELETING
  //  sets comment's `deleted` flag to `true`
    export const deleteCommentAPI = (commentId) => {
      return fetch(`${api}/comments/${commentId}`, {
        method: 'DELETE',
        headers
      })
    }
  //  sets posts's `deleted` flag to `true` AND
  //    all child comment's `parentDeleted` flag to `true`
    export const deletePostAPI = (postId) => {
      return fetch(`${api}/posts/${postId}`, {
        method: 'DELETE',
        headers
      })
    }

// ADDING
  // Adds a post:
  //  {id, timestap, title, body, author, category===existingCategory}
  export const addPostAPI = (addPostData) => {
    return fetch(`${api}/posts`, {
      method: 'POST',
      headers,
      ...addPostData,
       })
  }

  // Adds a comment to a post:
  //  {id, timestap, body, author, parentId===existingPostId}
  export const addCommentAPI = (addCommentData) => {
    return fetch(`${api}/comments`, {
      method: 'POST',
      headers,
      ...addCommentData,
    })

  }

// MODIFYING/ EDITING
  // Vote on a post
  //  {option=="upVote" OR option=="downVote" see export at top of file}
  export const votePostAPI = (postId, vote) => {
    if (vote !== 'upVote' && vote !== 'downVote') {
      console.log('api.js, votePostAPI, "vote" must a string containing either: "upVote" or "downVote"');
    }
    return fetch(`${api}/posts/${postId}`, {
      method: 'POST',
      headers,
      body: {
        option: vote
      }
     });
  }
  // Vote on a comment
  //  {option=="upVote" OR option=="downVote" see export at top of file}
  export const voteCommentAPI = (commentId, vote) => {
    return fetch(`${api}/comments/${commentId}`, {
      method: 'POST',
      headers,
      body: {
        option: vote
      }
    });
  }


  // TODO:
  // QUESTION: editing a comment, we *change* the timestamp ?
  //    But editing a Post, we do *Not* change the timestamp ?

  // Edit a post
  //  {title, body}
  export const editPostAPI = (postId, editPostData) => {
    return fetch(`${api}/posts/${postId}`, {
      method: 'PUT',
      headers,
      body: {
        ...editPostData,
      }
    })
  }
  // Edit a comment
  //   QUESTION: editing a comment, we *change* the timestamp ?
  //  {timestamp, body}
  export const editCommentAPI = (commentId, editCommentData) => {
    return fetch(`${api}/comments/${commentId}`, {
      method: 'PUT',
      headers,
      body: {
        ...editCommentData,
      }
    })

  }










// NOTES:
  // Business logic of handling the response is now in the actionCreator.
  //  Not sure I'm happy with it there, but it works Now!!
  // thing is that since all the "thenning" was happened here,
  // "cannot then on undefined" or something ike that
  // -- there were no more "then"s to be had.
  // Can "then" HERE or THERE. Not both.  Not Even *1* of them!
  // *EITHER RETURN, OR  THEN*
