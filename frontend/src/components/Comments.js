import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchComments } from '../state/comments/ducks';
import { upVoteComment, downVoteComment } from '../state/comments/ducks';
import { dateMonthYear, timeIn12HourFormat } from '../utils/helpers';
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
      this.props.getComments(postId);
    // } else {
      // console.log('Comments, postId === null');
    // }
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
          .map((comment) => {
            return (
              <li key={comment.id}>
                <p>{comment.body}</p>

                <div className="vote">
                  <div
                    className="comment-up-vote"
                    onClick={() => {this.props.onUpVoteComment(comment.id)}}>
                  </div>
                  {comment.voteScore}
                  <div
                    className="comment-down-vote"
                    onClick={() => {this.props.onDownVoteComment(comment.id)}}>
                  </div>
                </div>

                <p>by {comment.author},
                <small> {dateMonthYear(comment.timestamp)} at {timeIn12HourFormat(comment.timestamp)}</small>
                </p>
                <hr />
              </li>
            );
          })
        }
      </div>
    )
  }

}

function mapDispatchToProps(dispatch){
  return ({
    getComments:       (postId)    => dispatch(fetchComments(postId)),
    onUpVoteComment:   (commentId) => dispatch(upVoteComment(commentId)),
    onDownVoteComment: (commentId) => dispatch(downVoteComment(commentId)),
  })
}

function mapStoreToProps ( store ) {
  // console.log('in Comments, mapStoreToProps');

  const postId = store.viewData.selected || null;

  //  TODO: double check that if there is a comments array in store ,
  //    it is for *this* post

  // turn object of comment objects into array of comment objects (for react mapping)
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
