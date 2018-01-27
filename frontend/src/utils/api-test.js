import * from './api';

// this file is to test my api.js code.
// see if I can GET, PUT, POST data as expected.

//FETCHING

  // Gets all categories listed in categories.js (modify that file as desired)
  fetchCategoriesAPI()
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, fetchCategories');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('fetchCategories data', data);}
    );

  // TODO: refactor to combine posts and postsCategory into a wrapper function
  // Gets all (ok, 10 at a time) posts
  fetchPosts()
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, fetchPosts');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('fetchPosts data', data);}
    );

  // Gets all (ok 10) posts from specified category
  fetchPostsCategoryAPI(category)
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, fetchPostsCategoryAPI');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('fetchPostsCategoryAPI data', data);}
    );

  // Gets specified post
  fetchPostAPI(postId)
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, fetchPostAPI');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('fetchPostAPI data', data);}
    );

  // Gets all comments associated with specified post
  fetchCommentsAPI(postId)
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, fetchCommentsAPI');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('fetchCommentsAPI data', data);}
    );

  // Gets specified comment
  fetchCommentAPI(commentId)
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, fetchCommentAPI');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('fetchCommentAPI data', data);}
    );

//  DELETING
  //  sets comment's `deleted` flag to `true`
  deleteCommentAPI(commentId)
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, deleteCommentAPI');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('deleteCommentAPI data', data);}
    );
  //  sets posts's `deleted` flag to `true` AND
  //    all child comment's `parentDeleted` flag to `true`
  deletePostAPI(postId)
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, deletePostAPI');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('deletePostAPI data', data);}
    );
// ADDING

  // Adds a post:
  //  {id, timestap, title, body, author, category===existingCategory}
  addPostAPI(addPostData)
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, addPostAPI');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('addPostAPI data', data);}
    );

  // Adds a comment to a post:
  //  {id, timestap, body, author, parentId===existingPostId}
  addCommentAPI(addCommentData)
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, addCommentAPI');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('addCommentAPI data', data);}
    );


// MODIFYING/ EDITING

  // Vote on a post
  //  {option=="upVote" OR option=="downVote" see export at top of file}
  votePostAPI(postId, vote)
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, votePostAPI');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('votePostAPI data', data);}
    );

  // Vote on a comment
  //  {option=="upVote" OR option=="downVote" see export at top of file}
  voteCommentAPI(commentId, vote)
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, voteCommentAPI');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('voteCommentAPI data', data);}
    );

  // Edit a post
  //  {title, body}
  editPostAPI(postId, editPostData)
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, editPostAPI');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('editPostAPI data', data);}
    );

  // Edit a comment
  //  {timestamp, body}
 editCommentAPI(commentId, editCommentData)
    .then((response) => {
      if (!response.ok) {console.log('__response NOT OK, editCommentAPI');}
      return response;
    })
    .then((response) => response.json())
    .then((data) => {console.log('editCommentAPI data', data);}
    );
