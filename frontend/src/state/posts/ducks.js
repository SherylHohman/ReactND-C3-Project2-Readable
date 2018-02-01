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

  export const REQUEST_VOTE_ON_POST = 'REQUEST_VOTE_ON_POST';
   const VOTE_ON_POST_FAILURE = 'VOTE_ON_POST_FAILURE';
   const VOTE_ON_POST_SUCCESS = 'VOTE_ON_POST_SUCCESS';


// FAT ACTION CREATORS
  //  (include business logic to decides which action(s) to create/dispatch)
  //  (if need access to more state, refactor to use redux-thunk,
  //    aka Thunk Action Creators)

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
          // TODO: see data, determine how to proceed
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
          // TODO: see data, determine how to proceed

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
          // TODO: see data, determine how to proceed

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
          // TODO: see data, determine how to proceed

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

  export function voteOnPost(postId, vote){
    console.log('____vote:', vote);
    return (dispatch) => {

      dispatch({
        type: REQUEST_VOTE_ON_POST
      });

      ReaderAPI.voteOnPost(postId, vote)
        .then((response) => {
          if (!response.ok) {
            console.log('__response NOT OK, received in voteOnPost');
            throw Error(response.statusText);
          }

          return response;
        })
        .then((response) => response.json())
        .then((data) => {
          // data returned is the full post object.
          // TODO: Problem: voteScore was NOT updated !!?? at the server !!??
          console.log('voteScore after apiCall:', data.voteScore);
          return (
            dispatch({
              type: VOTE_ON_POST_SUCCESS,
              postId: data.id,
              // TODO: debug why server didn't update voteScore !!
              voteScore: data.voteScore,
            })
          )}
        )

        .catch(err => {
          console.error(err);  //  in case of render error
          dispatch({
            type: VOTE_ON_POST_FAILURE,
            err,
            error: true,
          })
        });

    };  // anon function(dispatch) wrapper
  };
  // export function upVotePost(dispatch, id){
  //   console.log('hello--upVotePost');
  //   // return (dispatch, id) => dispatch(voteOnPost(id, ReaderAPI.upVote));
  //   voteOnPost(dispatch, id, ReaderAPI.upVote);
  // };
  // export function downVotePost(dispatch, id){
  //   voteOnPost(id, ReaderAPI.downVote)
  // };


// ACTION CREATORS (regular)

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

      case REQUEST_VOTE_ON_POST:
        // TODO:
        return state;
      case VOTE_ON_POST_SUCCESS:
        return ({
          ...state,
          [action.postId]: {
            ...state[action.postId],
            voteScore: action.voteScore,
          }
        });
      case VOTE_ON_POST_FAILURE:
          // TODO: UI error message
          return state;

      default:
        return state;
    }
  }


// export default post
export default posts


/*
NOTES:
  TODO: after deletion, if post's page is loaded, then it may show up empty
  - redirect to home, "all posts" page
  - or display "This Post has been Deleted, or Never Existed"
    (also covers the case of an invalid posts URL)
  - Both
*/
