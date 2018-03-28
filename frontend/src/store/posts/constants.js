// ACTION TYPES
  export const REQUEST_POSTS = 'REQUEST_POSTS';
    export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
    export const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';

  export const REQUEST_POST = 'REQUEST_POST';
    export const FETCH_POST_SUCCESS = 'FETCH_POST_SUCCESS';
    export const FETCH_POST_FAILURE = 'FETCH_POST_FAILURE';

  export const REQUEST_ADD_POST = 'REQUEST_ADD_POST';
     export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
     export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

  export const REQUEST_EDIT_POST = 'REQUEST_EDIT_POST';
    export const EDIT_POST_SUCCESS = 'EDIT_POST_SUCCESS';
    export const EDIT_POST_FAILURE = 'EDIT_POST_FAILURE';

  export const REQUEST_DELETE_POST = 'REQUEST_DELETE_POST';
  export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
    export const DELETE_POST_FAILURE = 'DELETE_POST_FAILURE';

  export const REQUEST_VOTE_ON_POST = 'REQUEST_VOTE_ON_POST';
    export const VOTE_ON_POST_FAILURE = 'VOTE_ON_POST_FAILURE';
    export const VOTE_ON_POST_SUCCESS = 'VOTE_ON_POST_SUCCESS';

// indented  "exports" are used only within posts directory (due to separating 1 file into 3 files)
// outdented "exports" are exported to also  use outside this directory


// TODO: consider the following pattern

// export default postActionTypes = {
//   const REQUEST_POSTS        = 'REQUEST_POSTS';
//   const REQUEST_POST         = 'REQUEST_POST';
//   const REQUEST_ADD_POST     = 'REQUEST_ADD_POST';
//   const REQUEST_EDIT_POST    = 'REQUEST_EDIT_POST';
//   const REQUEST_DELETE_POST  = 'REQUEST_DELETE_POST';
//   const REQUEST_VOTE_ON_POST = 'REQUEST_VOTE_ON_POST';
//   const DELETE_POST_SUCCESS  = 'DELETE_POST_SUCCESS';
// }

// export postActionTypesInternal = {
//     const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
//     const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';

//     const FETCH_POST_SUCCESS = 'FETCH_POST_SUCCESS';
//     const FETCH_POST_FAILURE = 'FETCH_POST_FAILURE';

//     const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
//     const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

//     const EDIT_POST_SUCCESS = 'EDIT_POST_SUCCESS';
//     const EDIT_POST_FAILURE = 'EDIT_POST_FAILURE';

//     const DELETE_POST_FAILURE = 'DELETE_POST_FAILURE';

//     const VOTE_ON_POST_FAILURE = 'VOTE_ON_POST_FAILURE';
//     const VOTE_ON_POST_SUCCESS = 'VOTE_ON_POST_SUCCESS';
// }

