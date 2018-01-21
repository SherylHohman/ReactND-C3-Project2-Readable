import * as ReaderAPI from '../../utils/api';

// ACTION TYPES
  export const FETCH_POSTS = 'FETCH_POSTS';
  export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
  export const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';

  export const FETCH_POST_DETAILS = 'FETCH_POST_DETAILS';
  export const FETCH_POST_DETAILS_SUCCESS = 'FETCH_POST_DETAILS_SUCCESS';
  export const ADD_POST = 'ADD_POST';
  export const EDIT_POST = 'EDIT_POST';
  export const DELETE_POST = 'DELETE_POST';
  export const INCREMENT_VOTE = 'INCREMENT_VOTE';
  export const DECREMENT_VOTE = 'DECREMENT_VOTE';


// FAT ACTION CREATORS
  //  (business logic decides which action(s) to create/dispatch)
  //  if need access to more state, refactor to use redux-thunk
  //    (Thunk Action Creators)

  export function fetchPosts(dispatch){
    console.log('--in posts action creator, fetchPosts');
    dispatch({
      type: FETCH_POSTS,
    });
    ReaderAPI.fetchPosts()
      .then(postsArray => {

        console.log('--postsArray from fetchPosts', postsArray);

        //  1) API returns array of posts; store needs object of posts
        //  2) inner post objects have extra [function], and __proto__ properties
        //     try to remove them before sending to state/store/ or anywhere else

        //   console.log('cDM|fetchPosts: postsArray as array of objects, where EACH POST has extraneous getRequest properties: ', postsArray)

          const posts = postsArray.reduce((acc, arrItem) => {
            const { id, title, body, category, timestamp,
              commentCount, deleted, voteScore } = arrItem;
            return ({
              ...acc,
               [id]: {
                 id,
                 title,
                 body,
                 category,
                 timestamp,
                 commentCount,
                 deleted,
                 voteScore,
               }
            }
          )}, {});

          console.log('--posts reducer, posts after transformation', posts);

        return (
          dispatch({
            type: FETCH_POSTS_SUCCESS,
            posts,
          }) // dispatch success
        )} // return
      ) // then
      .catch(err => {
        console.error(err);  //  in case of render error
        dispatch({
          type: FETCH_POSTS_FAILURE,
          err,
          error: true,
        })
      });
  };



// ACTION CREATORS
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
  export function fetchPostDetails(TODO){
    // fetch all posts by ownerID (post)
    return ({
      type: FETCH_POST_DETAILS,
      // TODO:
    });
  };
  export function fetchPostDetailsSuccess(TODO){
    // fetch all posts by ownerID (post)
    return ({
      type: FETCH_POST_DETAILS_SUCCESS,
      // TODO:
    });
  };
  export function addPost(TODO){
    // fetch all posts by ownerID (post)
    return ({
      type: ADD_POST,
      // TODO:
    });
  };
  export function editPost(TODOTODO){
    return ({
      type: EDIT_POST,
      // TODO
    });
  };
  export function deletePost(TODO){
    // (set in DB and state)
    // doesn't actually DELETE post from database
    // it sets it's and it's "deletedPost" flag to True, hence it won't be returned by an SPI query ?
    //  OR, I need to check the returned Query, and Only Display posts where its "deletedPost" is false.

    // REMEMBER to update deletedParent property on every COMMENT owned by the deletedPost.
    //
    return ({
      type: DELETE_POST,
      // TODO:
    });
  };
  export function incrementVote(id){
    // need id, or id and voteScore ?
    return ({
      type: INCREMENT_VOTE,
      id,
    });
  };
  export function decrementVote(id){
    // need id, or id and voteScore ?
    return ({
      type: DECREMENT_VOTE,
      id,
    });
  };

// INITIAL STATE
  const postsInitialState = {}

// SAMPLE DATA
  const samplePost = {
      id: '8xf0y6ziyjabvozdd253nd',
      timestamp: 1467166872634,
      title: 'Udacity is the best place to learn React',
      body: 'Everyone says so after all.',
      author: 'thingtwo',
      category: 'react',
      voteScore: 6,
      deleted: false,
      commentCount: 2
    }

  const samplePosts = {
    ...postsInitialState,
    "8xf0y6ziyjabvozdd253nd": { ...samplePost },
  };


  //
    // store element == samplePosts format
    //    ie an object of post objects,
    //    where property name of each (post object) === the id for that post.

    // state (inside the components) transforms the wrapper object of post objects
    //   into an array of post objects
    //   - each array element represents <==> an [id] property value
    //  Note [id] is a string value that "happens" to == posts[id].id !

// REDUCERS

  // state is an object of (multiple) post objects
  function posts(state=postsInitialState, action) {

    console.log('--in posts reducer, action:', action);

    const { id, timestamp, title, body, author, category } = action;
    switch (action.type){
      case FETCH_POSTS:
        // action data should be an object of post objects
        // when fetch posts from database is successful, add to store
        return ({
          ...state,
          posts: action.posts,
        });
      case FETCH_POST_DETAILS:
        // Hmm... in this case should "state" be a single post
        // ..or the list of all posts.  Do I need a new action reducer
        // `post` or `postDetails` for actions requiring only a single post?
        // I guess it'll help when I see th eresults of 'FETCH posts API"
        //.. really not a Lot more I can do without either a UI,

        // action data should be a post item with all fields
        // const { id, timestamp, title, body, author, category } = action;
        const { voteScore, deleted, commentCount } = action
        return ({
          ...state,
          // ?? am I inserting to a list of posts?,
          //  or is this post the entire thing?
            id,
            timestamp,
            title,
            body,
            author,
            category,
            voteScore,
            deleted,
            commentCount,
        });
      case ADD_POST:
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
      case EDIT_POST:
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
      case DELETE_POST:
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
      case INCREMENT_VOTE:
        // action data should be a post item with an id field
        return ({
          ...state,
          [action.id]: {
            ...state[action.id],
            voteScore: state[action.id].voteScore + 1,
          }
        });
      case DECREMENT_VOTE:
        // action data should be a post item with an id field
        return ({
          ...state,
          [action.id]: {
            ...state[action.id],
            voteScore: state[action.id].voteScore - 1,
          }
        });

      default:
        return state;
    }
  }


// export default combineReducers({
//   post,
//   posts,
// })

// export default post
export default posts


/*
NOTES: after deletion, if post's page is loaded, then it may show up empty
  - redirect to home, "all posts" page
  - or display "This Post has been Deleted, or Never Existed"
    (also covers the case of an invalid posts URL)
  - Both
*/
