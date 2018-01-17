// VOTES
  -attachedToComment/Post
  -count
  TOGGLE
    INCREMENT
    DECREMENT
  GET_COUNT
  showCount
  myVote (button) - toggles(upVote/noVote)
    increments / decrements total count by 1
    visualDisplay of (upVote/noVote)
    updates:showCount
    className=upVote/noVote, where
      upvote="upVote",
      noVote="noVote",
      downVote="downVote"(if implement downVote)
  -usersWhoUpvoted(array: add /remove currentUserFromArray)
  -currentUser''sVote

-- OR could store upvotes on User Array
so it's part of th user profile, not comment/post profile.
IF on the Vote/Post/Comment, then user will be added/removed from the array when his/her voe chanages
IF on the UserProfile, then comment/post will be added/removed from array when his/her vote changes.


// COMMENTS
  -commentID
  -postID (postAttachedTo)
  // -ownComment (T/F - is this comment by me?)
  -author
  -commentText
  -numVotes
  ADD
  EDIT      (only if ownComment)
  REMOVE    (only if ownComment)
  showCommentText
  showEditButton   //(only if ownComment)
  showRemoveButton //(only if ownComment)
  showNumVotes
  // - isCurrentUser (T/F: if this post was authored by the currentUser)


  // POSTS
  -postID
  -thePostText
  -title
  -author   or authorID
  -category (or categories) or categoryID
  -dateFirstPosted
  -(dateLastUpdated)
  -postText
  -numVotes
  -numComments
  -theComments
  ADD
  EDIT      (only if ownPost)
  REMOVE    (only if ownPost)
  showPostText
  showEditButton   //(only if ownPost)
  showRemoveButton //(only if ownPost)
  showNumVotes
  showDate
  showCategory
  showNumComments
  // - isCurrentUser (T/F: if this post was authored by the currentUser)

/**  NOPE, Specs Say NO USER - so Can't Store USER info in DB
 **        THEREFORE, No Way to Prevent anyone from Deleting/Editing
 **                   A Different User's Post!!
 ***                  Or Voting an UNLIMITED number of times!
//USER
  -userID
  -userName
  -myPosts
  -myComments
  -myPostVotes
  -myCommentVotes
Cannot Vote for own Post or Comment
Can ONLY delete/edit own Post/Comment
Can only VoteOnce for Post/Comment (that is Not Own)
When create a post/comment, Author is automatically set to this userID

Therefore, I'll also need a *simple*
  "change user" interface.
  So I can change the name/id of current user.
  It won't authenticate, and anyone using app can change it at anytime, to be whoever they want..
  setCurrentUser(inputField/button)
    -adds user if not already exist to AllUsers
    -changes STATE to reflect currentUser
    - current View must Update IF..
      post: is/isnt user post to vice-versa
        (not necessarily, if wasnt to wasnt)
        (b/c edit and vote capabilities change)
      comments: is/isnt to vice-versa
        b/c edit and vote capabilities change

  // All Users
    - array of allUser Ids or Names
    addUser
    getUsers
    isCurrentUserInArray ()

// Application State
 -currentUser
 addUser
 changeUser
   when currentUser changes, some boolean feature in each view needs to check against currentUser to see if it''s state needs to be updated. For example, a post may add/remove Edit or Voting Capability. Same for Comments.

**/
