// ACTION TYPES
  export const ADD_COMMENT = 'ADD_COMMENT';
  export const EDIT_COMMENT = 'EDIT_COMMENT';
  export const DELETE_COMMENT = 'DELETE_COMMENT';
  export const GET_COMMENTS = 'GET_COMMENTS';
  export const INCREMENT_VOTE = 'INCREMENT_VOTE';
  export const DECREMENT_VOTE = 'DECREMENT_VOTE';

// ACTION CREATORS
  export function getComments(postID){
    // TODO: ? accepts postID or comments object of comments
    return ({
      type: GET_COMMENTS,
      // TODO: ? sends out postID or a comments object of comments
      // is this part of the middleware thing ?
      id: postID
    });
    // API fetches of all comments for current post
    //  API needs ID of current post
    //  API returns comments for that post
  };

  export function editComment({ id, title, body }){
    return ({
      type: EDIT_COMMENT,
      id,
      // these are the items that can be edited
      title,
      body,
      // may also need to pass in all info off the object, so can populate
      // the 'edit' dialog box ? OR only show (an prepopulate) the values
      // that can be edited by the user?
      // on that note: datetime stays as Orig time, nor Edit time, right?
    });
  };

  export function deleteComment(id){
    // just needs a commentID, or the wholeComment object?
    return ({
      type: DELETE_COMMENT,
      id,
    });
    // (set in DB and state)
    // doesn't actually DELETE comment from database
    // it sets it's and it's "deletedComment" flag to True, hence it won't be returned by an SPI query ?
    //  OR, I need to check the returned Query, and Only Display comments where its "deletedComment" AND its  "deletedPost" flags are both false.
    //
  };

  export function incrementVote(id){
    // needs commentID, and current voteScore, OR a comment Object
    // actually, with just the commentID, the STORE has access
    //  to the voteScore for this comment
    return ({
      type: INCREMENT_VOTE,
      id,
      // I don't need voteScore, do I?
    });
  };

  export function decrementVote(id){
    // needs commentID, and current voteScore, OR a comment Object
    return ({
      type: DECREMENT_VOTE,
      id,
      // I don't need voteScore, do I?
    });
  };

// SAMPLE DATA
  const sampleComment = {
      id: '894tuq4ut84ut8v4t8wun89g',
      parentId: "8xf0y6ziyjabvozdd253nd",
      timestamp: 1468166872634,
      body: 'Hi there! I am a COMMENT.',
      author: 'thingtwo',
      voteScore: 6,
      deleted: false,
      parentDeleted: false
    }

  const sampleComments = {
    "894tuq4ut84ut8v4t8wun89g": { ...sampleComment },
    // "andAnother [id] string": {..anotherSampleComment},
    // etc
  };

  // store element is sampleComments
  //    aka an object of comment objects, where property name for each (comment object) is the id for that comment.

  // state (inside the components) would be transformed into an array of sampleComment items

// REDUCER(s)
  function comments(state=sampleComments, action) {
  // function comment(state=sampleData, action) {
    const { id } = action
    switch (action.type){
      case GET_COMMENTS:
        // when Get Comments API has returned with list of all comments  (hm is this ALL comments, or only comments for a particular post ?)
        return ({
          ...state,
          comments: action.comments,
          // TODO:
          // UH Oh, actionCreator took in an postID
          // but here, I need object of comments objects.
          // now I'm confused. API needs id, I need comment objects.
          //  is this where middleware comes in ?
          //   bit more clarification.  Head still doesn't understand fully.
        });
      case ADD_COMMENT:
        return ({
          ...state,
          [action.comment]: {
            id: action.id,
            parentId: action.parentId,
            timestamp: action.timestamp,
            body: action.body,
            author: action.author,
            voteScore: 1,
            deleted: false,
            parentDeleted: false,
          }
        });
      case EDIT_COMMENT
        return ({
          ...state,
           [action.id]: {
            ...[action.id],
            // do I keep the original post time, or update to time of latest edit ?
            // timestamp: action.timestamp,
            body: action.body,
            title: action.title,
           }
        });
      case DELETE_COMMENT
        // needs the comment ID
        return ({
          ...state,
          [action.id]: {
            ...state[action.id],
            deleted: true,
          }
        });
      case INCREMENT_VOTE
        // needs the comment ID
        return ({
          ...state,
          [action.id]: {
            ...state[action.id],
            voteScore: state[action.id].voteScore + 1,
          }
        });
      case DECREMENT_VOTE
        // needs the comment ID
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

// export default comment
export default comments
