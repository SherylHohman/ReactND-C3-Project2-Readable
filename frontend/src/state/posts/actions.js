// ACTIONS
export const ADD_POST = 'ADD_POST';
export const EDIT_POST = 'EDIT_POST';
export const DELETE_POST = 'DELETE_POST';
export const GET_POSTS = 'GET_POSTS';
export const INCREMENT_VOTE = 'INCREMENT_VOTE';

// ACTION CREATORS
  export function getPosts({
    // TODO:
    // fetch all posts by ownerID (post)
  });

  export function addPost({
    // TODO:
    // fetch all posts by ownerID (post)
  });

  export function editPost({
    // TODO
  });

  export function deletePost({
    // TODO:
    // (set in DB and state)
    // doesn't actually DELETE post from database
    // it sets it's and it's "deletedPost" flag to True, hence it won't be returned by an SPI query ?
    //  OR, I need to check the returned Query, and Only Display posts where its "deletedPost" is false.

    // REMEMBER to update deletedParent property on every COMMENT owned by the deletedPost.
    //
  });

  export function incrementVote({
    // TODO
  });

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
    "8xf0y6ziyjabvozdd253nd": { ...samplePost },
  };

  // store element is samplePosts
  //    aka an object of post objects, where property name for each (post object) is the id for that post.

  // state (inside the components) would be transformed into an array of samplePost items
