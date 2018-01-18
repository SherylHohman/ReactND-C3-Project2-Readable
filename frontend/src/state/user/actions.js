const SET_CURRENT_USER = 'SET_CURRENT_USER';
// const GET_ALL_USERS = 'GET_ALL_USERS';
// const ADD_USER = 'ADD_USER';
// const DELETE_USER = 'DELETE_USER';


// have the user enter their name (from any url)
// will be app state/store only.

/* will be matched against post and comment authors
  - for voting
    - cannot upvote if it's your own post (==author)
      note, that all posts/comments automaticallly get
      assigned 1 vote, counting as the author's own
      upvote
    - cannot downvote a post that is NOT yours more than
      once in a session.  Of course since user and
      detailed voting info aren't stored in the db, a
      page refresh will enable user to downvote again.
  - for deleting
    - cannot delete a comment or post where user !== author
  - for editing
    - cannot edi ta comment or post where user !== author

  Could also implement a rule, that if user name is not provided, app can only be used in "Read Only" mode.
    - no voting, editing, posting, deleting is possible

  Could additionally extend this to a semi-login thing,
    whereeven a signed in user cannot vote, unless they have a comment or post in the db: ie if they are an
    author.
    This is as close to a 'LOGIN' / Signed-Up User/member
    as I can see without changing the server API and DB..
      - The "member list" could be obtained  by fetching
      all posts and comments in the DB, then collecting
      "author" names of everyone!, then caching the result in the app STORE. (updating this list whenever a post/comment is added and maybe even deleted)
    Probably not worth it..


*/
