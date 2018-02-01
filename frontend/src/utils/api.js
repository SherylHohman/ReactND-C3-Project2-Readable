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
  // for app, aka response! - for POST/PUT: sends body
  'Content-Type': 'application/json',
};

//FETCHING

  // Gets all categories listed in categories.js (modify that file as desired)
  export const fetchCategories = () => {
    return fetch(`${api}/categories`, { method: 'GET', headers })
  };

  // Gets all (ok, 10 at a time) posts
  export const fetchPosts = () => {
    return fetch(`${api}/posts`, { method: 'GET', headers })
  };
  // TODO: refactor to combine posts and postsCategory into a wrapper function
  // Gets all (ok 10) posts from specified category
  export const fetchPostsCategory = (category) => {
    return fetch(`${api}/${category}/posts`, { method: 'GET', headers })
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
    console.log('...utils/api voteOnComment, commentId:', commentId, 'voteValue:', vote);
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
      body: JSON.stringify({
        ...editPostData,
      })
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
        ...editCommentData,
      })
    });
  };



// NOTES:
  // Business logic of handling the responses are now in the (fat) action creators.
  //  Not sure I'm happy with it there, but it works!!
  //  Basically, I need to check response.ok to know whether to send out
  //    a _SUCCESS action or a _FAILURE action
  //    and that must happen before res.json()
  //  So, *all* the "thenning" must happen in 1 location.
  //    Essentiallly, it seems better to dispatch actions there than here,
  //    so I just return the raw response from here.
  //  This may change, if I learn a better pattern for handling the combo of:
  //    dispatch success/failure, unwrap the api res, parsing data from api
