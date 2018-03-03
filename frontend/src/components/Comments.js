import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUri } from '../store/viewData';
import { fetchComments } from '../store/comments';
import { upVoteComment, downVoteComment } from '../store/comments';
import { editComment, deleteComment } from '../store/comments';
import { dateMonthYear, timeIn12HourFormat, titleCase } from '../utils/helpers';
import NewComment from './NewComment';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';


export class Comments extends Component {

  static propTypes = {
    postId: PropTypes.string,//.isRequired,
    comments: PropTypes.array,
  }

  state = {
    isOpenModal: false,
    id: '',
    body: '',
    author: '',
  };

  componentDidMount(){
    const postId = this.props.postId;
    // console.log('...in Comments ComponentDidMount, props', this.props);
    // console.log('Comments componentDidMount ..fetching, comments');
    this.props.fetchComments(postId);
  }

  controlledBodyField(e, currentText){
    e.preventDefault();
    this.setState({body: currentText});
  }
  controlledAuthorField(e, currentText){
    e.preventDefault();
    this.setState({author: titleCase(currentText)});
  }
  onEditComment(comment){
      this.setState({
        id: comment.id,
        body: comment.body,
        author: comment.author,
        isOpenModal: true,
      });
  }
  onSave(){
    this.props.updateComment({
      id:this.state.id, //id, //: this.props.id,
      body: this.state.body.trim(),
      author: this.state.author,
      timestamp: Date.now(),   // supposed to update timestamp ?
    });
    this.closeModal();
  }
  closeModal(){
    this.setState({id:'', body:'', author: '', isOpenModal: false});
  };
  onSubmit(e){
    e.preventDefault();
    // return false;
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
                <p className="link">
                  <span onClick={() => {this.props.onDeleteComment(comment.id)}}> delete </span>
                   <span className="no-link"> | </span>
                  <span onClick={(e) => {this.onEditComment(comment)}}> edit </span>
                </p>
                <hr />
              </li>
            );
          })
        }

        <NewComment />

        <div>
          <Modal little
            open={this.state.isOpenModal}
            onClose={ ()=>this.closeModal() }
            >
            <div>
              <form onSubmit={(e)=> {this.onSubmit(e)}}>

                <div>
                  <p className="field-label-left">Comment:</p>
                  <textarea
                    className="comment-body"
                    type="text"
                    placeholder="Your insightful comment.."
                    value={this.state.body}
                    onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
                    rows={'2'}
                    />
                </div>

                <div>
                  <p className="field-label-left">Author:</p>
                  <input
                    className="comment-author"
                    type="text"
                    placeholder="Your name in lights.."
                    value={this.state.author}
                    onChange={ (event) => {this.controlledAuthorField(event, event.target.value)} }
                    />
                </div>

                <button
                  className="on-save"
                  onClick={() => {this.onSave()}}
                  >
                  Save
                </button>
                <button
                  className="on-cancel"
                  onClick={() => {this.closeModal();
                }}>
                  Cancel
                </button>

              </form>
            </div>
          </Modal>
        </div>

      </div>
    )
  }

}

function mapDispatchToProps(dispatch){
  return ({
    fetchComments:     (postId)    => dispatch(fetchComments(postId)),
    onUpVoteComment:   (commentId) => dispatch(upVoteComment(commentId)),
    onDownVoteComment: (commentId) => dispatch(downVoteComment(commentId)),
    onDeleteComment:   (commentId) => dispatch(deleteComment(commentId)),
    updateComment:     (editCommentData) => dispatch(editComment(editCommentData)),
  })
}

function mapStoreToProps (store, ownProps) {

  // const postId = store.viewData.currentId || null;
  // const uri = getUri(ownProps.routerProps) || null;

  // passed as props from Post - change this when put uri into store
  // const uri = ownProps.uri;

  // either pass "store" in as second prop, or parent component needs to pass uri
  // const uri = getUri(null, store) || null;
  const uri = getUri(ownProps.routerProps) || null;


  const postId = uri && uri.currentId;  // or uri.params.postId // or uri.postId
  // console.log('Comments, mSTP, uri', uri);

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
