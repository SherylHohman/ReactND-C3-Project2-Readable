import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchComments } from '../store/comments';
import { upVoteComment, downVoteComment, editComment, deleteComment } from '../store/comments';
import { dateMonthYear, timeIn12HourFormat } from '../utils/helpers';
import NewComment from './NewComment';
import PropTypes from 'prop-types';


export class Comments extends Component {

  static propTypes = {
    post: PropTypes.string,//.isRequired,
    comments: PropTypes.array,
  }

  componentDidMount(){
    const postId = this.props.postId;
    // console.log('...in Comments ComponentDidMount, props', this.props);
    // console.log('postId', postId, 'comments', this.props.comments);

    // if (postId !== null){
      console.log('Comments componentDidMount ..fetching, comments');
      this.props.fetchComments(postId);
    // } else {
      // console.log('Comments, postId === null');
    // }
  }

  onEditComment(id){
    // Modal
    this.props.onEditComment(id);
  }

  render() {
    const { comments, postId } = this.props;

    if (postId === null) {
      console.log('Comments, are null.');
      return (
        <div>Unable to get comments for this post</div>
      )
    }
    if (comments === []) {
      console.log('There are no comments for this post.');
      return (
        <div>Be the first to comment on this post</div>
      )
    }
    // if (comments[0].parentDeleted) {
    //   return (
    //     <div>
    //       <h3> ..Oops! This post has been deleted.</h3>
    //       <p>No comments to show.</p>
    //     </div>
    //   )
    // }

    return  (
      <div>
        <hr />
        {comments.filter((comment) => !comment.deleted && !comment.parentDeleted)
          .sort((commentA, commentB) => {
            if (commentA === commentB) return 0;
            if (commentA.timestamp < commentB.timestamp) return 1;
            return -1;
          })
          .map((comment) => {
            return (
              <li key={comment.id}>
                <p>{comment.body}</p>

                <div className="vote">
                  <div
                    className="comment-up-vote"
                    onClick={() => {this.props.onUpVoteComment(comment.id)}}
                  >
                  </div>
                  {comment.voteScore}
                  <div
                    className="comment-down-vote"
                    onClick={() => {this.props.onDownVoteComment(comment.id)}}
                  >
                  </div>
                </div>

                <p>by {comment.author},
                <small> {dateMonthYear(comment.timestamp)} at {timeIn12HourFormat(comment.timestamp)}</small>
                </p>

              {/*TODO: link styling, change cursor to hand on hover*/}
                <p className="edit-delete-comment">
                  <span onClick={(e) => {this.onEditComment(e, comment.id)}}>edit</span>
                   |
                  <span onClick={() => {this.props.onDeleteComment(comment.id)}}>delete</span></p>
                <hr />
              </li>
            );
          })
        }
      <NewComment />
      </div>
    )
  }

}

function mapDispatchToProps(dispatch){
  return ({
    fetchComments:       (postId)    => dispatch(fetchComments(postId)),
    onUpVoteComment:   (commentId) => dispatch(upVoteComment(commentId)),
    onDownVoteComment: (commentId) => dispatch(downVoteComment(commentId)),
    onEditComment:     (commentId) => dispatch(editComment(commentId)),
    onDeleteComment:   (commentId) => dispatch(deleteComment(commentId)),
  })
}

function mapStoreToProps ( store ) {

  const postId = store.viewData.currentId || null;

  //  TODO: if there is already a comments array in store,
  //    double check that it is for *this* post

  const commentIds = Object.keys(store.comments);
  const comments = commentIds.reduce((acc, commentId) => {
    return acc.concat([store.comments[commentId]]);
  }, []);

  return {
    postId,
    comments,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Comments);
