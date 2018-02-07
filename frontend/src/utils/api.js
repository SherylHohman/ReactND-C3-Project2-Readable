import { HOME } from '../store/viewData';

export const upVote = "upVote";
export const downVote = "downVote";

const api = "http://localhost:3001";

let token = localStorage.token;
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8);

const headers = {
  'Authorization': token,

  // for server, aka request - GET
  'Accept': 'application/json',

  // TODO: only put this header on POST an PUT requests
  // for app, aka response! - for POST/PUT: sends body
  'Content-Type': 'application/json',
};

//FETCHING

  // Gets all categories listed in categories.js (modify that file as desired)
  export const fetchCategories = () => {
    return fetch(`${api}/categories`, { method: 'GET', headers })
  };

  export const fetchPosts = (categoryPath=HOME.category.path) => {
    if (categoryPath === HOME.category.path || categoryPath === null) {
      // fetch all posts, mixed categories (returns 10 max)
      return fetch(`${api}/posts`, { method: 'GET', headers })
    } else {
      // fetch posts by category
      return fetch(`${api}/${categoryPath}/posts`, { method: 'GET', headers })
    }
  };

  // Gets specified post
  export const fetchPost = (postId) => {
    return fetch(`${api}/posts/${postId}`, {method: 'GET', headers })
  };

  // Gets all comments associated with specified post
  export const fetchComments = (postId) => {
    return fetch(`${api}/posts/${postId}/comments`, { method: 'GET', headers })
  };

  // Gets specified comment
  export const fetchComment = (commentId) => {
    return fetch(`${api}/comments/${commentId}`, { method: 'GET', headers })
  };

//  DELETING

  //  sets comment's `deleted` flag to `true`
    export const deleteComment = (commentId) => {
      return fetch(`${api}/comments/${commentId}`, {
        method: 'DELETE',
        headers
      });
    };
  //  sets posts's `deleted` flag to `true` AND
  //    all child comment's `parentDeleted` flag to `true`
    export const deletePost = (postId) => {
      return fetch(`${api}/posts/${postId}`, {
        method: 'DELETE',
        headers
      });
    };

// ADDING

  // Adds a post:
  //  {id, timestap, title, body, author, category===existingCategory}
  export const addPost = (addPostData) => {
    console.log('in my api, addPost, addPostData:', addPostData);
    return fetch(`${api}/posts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...addPostData,
      })
    });
  };

  // Adds a comment to a post:
  //  {id, timestap, body, author, parentId===existingPostId}
  export const addComment = (addCommentData) => {
    return fetch(`${api}/comments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...addCommentData,
      })
    });
  }

// MODIFYING/ EDITING

  // Vote on a post
  //  {option=="upVote" OR option=="downVote" see export at top of file}
  export const voteOnPost = (postId, vote) => {
    if (vote !== upVote && vote !== downVote) {
      throw Error('api.js, votePost, "vote" must a string containing either: "upVote" or "downVote"');
    }
    return fetch(`${api}/posts/${postId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
         option: vote
      })
     });
  }

  // Vote on a comment
  //  {option=="upVote" OR option=="downVote" see export at top of file}
  export const voteOnComment = (commentId, vote) => {
    if (vote !== upVote && vote !== downVote) {
      throw Error('api.js, votePost, "vote" must a string containing either: "upVote" or "downVote"');
    }
    return fetch(`${api}/comments/${commentId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        option: vote
      })
    });
  };

  // TODO:
  // QUESTION: editing a comment, we *change* the timestamp ?
  //    But editing a Post, we do *Not* change the timestamp ?

  // Edit a post
  //  {title, body}
  export const editPost = (postId, editPostData) => {
    return fetch(`${api}/posts/${postId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(editPostData)
    });
  };

  // Edit a comment
  //   QUESTION: editing a comment, we *change* the timestamp ?
  //  {timestamp, body}
  export const editComment = (commentId, editCommentData) => {
    return fetch(`${api}/comments/${commentId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        ...editCommentData
      })
    });
  };



// File NOTES:
  //  (Business logic of handling the responses aka)
  //  "thenning" happens in the Fat Action Creators
