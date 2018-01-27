import * as ReaderAPI from '../../utils/api';

// ACTION TYPES
  export const REQUEST_POSTS = 'REQUEST_POSTS';
  const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
  const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';

  export const REQUEST_POST = 'REQUEST_POST';
  const FETCH_POST_SUCCESS = 'FETCH_POST_SUCCESS';
  const FETCH_POST_FAILURE = 'FETCH_POST_FAILURE';

  export const REQUEST_ADD_POST = 'REQUEST_ADD_POST';
   const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
   const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

  export const REQUEST_EDIT_POST = 'REQUEST_EDIT_POST';
   const EDIT_POST_SUCCESS = 'EDIT_POST_SUCCESS';
   const EDIT_POST_FAILURE = 'EDIT_POST_FAILURE';

  export const REQUEST_DELETE_POST = 'REQUEST_DELETE_POST';
   const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
   const DELETE_POST_FAILURE = 'DELETE_POST_FAILURE';

  export const REQUEST_VOTE_POST = 'REQUEST_VOTE_POST';
   const VOTE_POST_FAILURE = 'VOTE_POST_FAILURE';
   const VOTE_POST_SUCCESS = 'VOTE_POST_SUCCESS';


// FAT ACTION CREATORS
  //  (business logic decides which action(s) to create/dispatch)
  //  if need access to more state, refactor to use redux-thunk
  //    (Thunk Action Creators)

  export function fetchPosts(dispatch){
    return (dispatch) => {

      dispatch({
        type: REQUEST_POSTS
      });

      ReaderAPI.fetchPosts()
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, fetchPosts');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {

          // posts are returned as an array
          //  change them to Post objects where key===post.id
          //  NO arrays in store
          const postsAsObjects = data.reduce((acc, postData)=>{
            return {
              ...acc,
              [postData.id]: postData,
            }
          }, {})

          return (
            dispatch({
              type: FETCH_POSTS_SUCCESS,
              posts: postsAsObjects,
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: FETCH_POSTS_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };

  export function fetchPost(dispatch){
    return (dispatch) => {

      dispatch({
        type: REQUEST_POST
      });

      ReaderAPI.fetchPost()
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, fetchPosts');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {
            // return {
            //   // TODO
            //   // [postData.id]: data,
            // }

          return (
            dispatch({
              type: FETCH_POST_SUCCESS,
              // post: post, // TODO
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: FETCH_POSTS_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };

  export function addPost(dispatch){
    return (dispatch) => {

      dispatch({
        type: REQUEST_ADD_POST
      });

      ReaderAPI.addPost()
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, addPost');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {

          return (
            dispatch({
              type: ADD_POST_SUCCESS,
              // TODO
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: ADD_POST_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };

  export function editPost(dispatch){
    return (dispatch) => {

      dispatch({
        type: REQUEST_EDIT_POST
      });

      ReaderAPI.editPost()
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, editPost');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {

          return (
            dispatch({
              type: EDIT_POST_SUCCESS,
              // TODO
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: EDIT_POST_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };

  export function deletePost(dispatch){
    return (dispatch) => {

      dispatch({
        type: REQUEST_DELETE_POST
      });

      ReaderAPI.deletePost()
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, deletePost');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {

          return (
            dispatch({
              type: DELETE_POST_SUCCESS,
              // TODO
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: DELETE_POST_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };

  export function votePost(dispatch){
    return (dispatch) => {

      dispatch({
        type: REQUEST_VOTE_POST
      });

      ReaderAPI.votePost()
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, votePost');
            throw Error(response.statusText);
          }
          return response;
        })

        .then((response) => response.json())
        .then((data) => {

          // posts are returned as an array
          //  change them to Post objects where key===post.id
          //  NO arrays in store
          const postsAsObjects = data.reduce((acc, postData)=>{
            return {
              ...acc,
              [postData.id]: postData,
            }
          }, {})

          return (
            dispatch({
              type: VOTE_POST_SUCCESS,
              posts: postsAsObjects,
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: VOTE_POST_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };


// ACTION CREATORS (regular)
  // export function fetchPosts(TODO){
  //   // fetch all posts by ownerID (post)
  //   return ({
  //     type: FETCH_POSTS,
  //     // TODO:
  //   });
  // };
  // export function fetchPostsSuccess(TODO){
  //   // fetch all posts by ownerID (post)
  //   return ({
  //     type: FETCH_POSTS_SUCCESS,
  //     // TODO:
  //   });
  // };
  // export function fetchPostsFailure(TODO){
  //   // fetch all posts by ownerID (post)
  //   return ({
  //     type: FETCH_POSTS_FAILURE,
  //     // TODO:
  //   });
  // };

  // export function fetchPostDetails(TODO){
  //   // fetch all posts by ownerID (post)
  //   return ({
  //     type: FETCH_POST_DETAILS,
  //     // TODO:
  //   });
  // };
  // export function fetchPostDetailsSuccess(TODO){
  //   // fetch all posts by ownerID (post)
  //   return ({
  //     type: FETCH_POST_DETAILS_SUCCESS,
  //     // TODO:
  //   });
  // };
  // export function addPost(TODO){
  //   // fetch all posts by ownerID (post)
  //   return ({
  //     type: ADD_POST,
  //     // TODO:
  //   });
  // };
  // export function editPost(TODO){
  //   return ({
  //     type: EDIT_POST,
  //     // TODO
  //   });
  // };
  // export function deletePost(TODO){
  //   // (set in DB and state)
  //   // doesn't actually DELETE post from database
  //   // it sets it's and it's "deletedPost" flag to True, hence it won't be returned by an SPI query ?
  //   //  OR, I need to check the returned Query, and Only Display posts where its "deletedPost" is false.

  //   // REMEMBER to update deletedParent property on every COMMENT owned by the deletedPost.
  //   //
  //   return ({
  //     type: DELETE_POST,
  //     // TODO:
  //   });
  // };
  // export function incrementVote(id){
  //   // need id, or id and voteScore ?
  //   return ({
  //     type: VOTE_POST,
  //     id,
  //   });
  // };
  // export function decrementVote(id){
  //   // need id, or id and voteScore ?
  //   return ({
  //     type: VOTE_POST_SUCCESS,
  //     id,
  //   });
  // };

// INITIAL STATE
  const postsInitialState = {}

// SAMPLE DATA
  // const samplePost = {
  //     id: '8xf0y6ziyjabvozdd253nd',
  //     timestamp: 1467166872634,
  //     title: 'Udacity is the best place to learn React',
  //     body: 'Everyone says so after all.',
  //     author: 'thingtwo',
  //     category: 'react',
  //     voteScore: 6,
  //     deleted: false,
  //     commentCount: 2
  //   }

  // const samplePosts = {
  //   ...postsInitialState,
  //   "8xf0y6ziyjabvozdd253nd": { ...samplePost },
  // };


// REDUCERS

  // state is an object of (multiple) post objects
  function posts(state=postsInitialState, action) {
    // console.log('posts reducer, action', action)

    const { id, timestamp, title, body, author, category } = action;
    switch (action.type){

      case REQUEST_POSTS:
        // TODO set loading spinner on
        return state;
      case FETCH_POSTS_SUCCESS:
        return ({
          ...state,
          ...action.posts,
          // TODO: turn loading spinner off
        });
      case FETCH_POSTS_FAILURE:
          // TODO: UI error message
          return state;

      case REQUEST_POST:
        // TODO set loading spinner on
        return state;
      case FETCH_POST_SUCCESS:
        return ({
          ...state,
          ...action.post,
          // TODO: turn loading spinner off
        });
      case FETCH_POST_FAILURE:
          // TODO: UI error message
          return state;


      case REQUEST_ADD_POST:
        // TODO:
        return state;
      case ADD_POST_FAILURE:
        // TODO error message
        return ({
          ...state,
        });
      case ADD_POST_SUCCESS:
        // TODO:
        // action data should be a post item with (const) fields
        // const { id, timestamp, title, body, author, category } = action;
        return ({
          ...state,
          // adds a new id and object to the posts object (quasi-list)
          [action.post]: {
            id,
            timestamp,
            title,
            body,
            author,
            category,
            voteScore: 1,
            deleted: false,
            commentCount: 0,
          }
        });

      case REQUEST_EDIT_POST:
        // TODO:
        return ({
          ...state,
        });
      case EDIT_POST_SUCCESS:
        // TODO:
        // action data should be a post item with (see const) fields
        // const {id, title, body, category} = action;
        return ({
          ...state,
           [action.id]: {
            ...[action.id],
            title,
            body,
            category,
            // do I keep the original post time, or update to time of latest edit ?
            // timestamp: action.timestamp,
            // don't allow author to be changed, right?
            // author: action.author,
           }
        });
      case EDIT_POST_FAILURE:
        // TODO: UI error message
        return state;

      case REQUEST_DELETE_POST:
        // TODO:
        return state;
      case DELETE_POST_SUCCESS:
        // TODO:
        // action data should be a post item with an id field
        return ({
          ...state,
          [action.id]: {
            ...state[action.id],
            deleted: true,
          }
          // Also Need to set `parentDeleted` property for ALL COMMENTS
          //  which are "owned" by this post.
        });
      case DELETE_POST_FAILURE:
        // TODO: UI error message
        return state;

      case REQUEST_VOTE_POST:
        // TODO:
        return state;
      case VOTE_POST_SUCCESS:
        // TODO:
        return ({
          ...state,
          // TODO:
          }
        );
      case VOTE_POST_FAILURE:
          // TODO: UI error message
          return state;

      default:
        return state;
    }
  }


// export default post
export default posts


/*
NOTES: after deletion, if post's page is loaded, then it may show up empty
  - redirect to home, "all posts" page
  - or display "This Post has been Deleted, or Never Existed"
    (also covers the case of an invalid posts URL)
  - Both
*/
