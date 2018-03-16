import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLoc } from '../store/viewData';
import { fetchComments } from '../store/comments';
import { upVoteComment, downVoteComment } from '../store/comments';
import { editComment, deleteComment } from '../store/comments';
import { dateMonthYear, timeIn12HourFormat, titleCase } from '../utils/helpers';
import NewComment from './NewComment';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import { createSelector } from'reselect';


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

    validField: {
      body:   true,
      author: true,
    },
    touchedField: {
      body:   false,
      author: false,
    }
  };

  componentDidMount(){
    const postId = this.props.postId;
    // console.log('...in Comments ComponentDidMount, props', this.props);
    // console.log('Comments componentDidMount ..fetching, comments');
    this.props.fetchComments(postId);
  }

  touchField(key){
    this.setState({
      touchedField: {
        ...this.state.touchedField,
        [key]: true,
      }
    });
  }
  validateField(key, newText){
    // setState is async, so cannot use the value state has for this field
    // hence validating on newText (the value setState is setting the field to)
    const isValid = !!newText;  // !! empty string, null, undefined
    this.setState({
      validField: {
        ...this.state.validField,
        [key]: isValid,
      }
    });
  }
  updateFieldStatus(key, newTextValue){
    this.touchField(key);
    this.validateField(key, newTextValue)
  }

  controlledBodyField(e, currentText){
    e.preventDefault();
    this.setState({body: currentText});
    this.updateFieldStatus('body', currentText)
  }
  controlledAuthorField(e, currentText){
    e.preventDefault();
    this.setState({author: titleCase(currentText)});
    this.updateFieldStatus('author', currentText)
  }

  clickDisabled(e){
    e.preventDefault();
  }
  canSubmit(){
    const keys = Object.keys(this.state.validField);
    const allFieldsValid = keys.every((key) => {
      return this.state.validField[key];
    })
    const anyFieldTouched = keys.some((key) => {
      return this.state.touchedField[key];
    })
    return anyFieldTouched && allFieldsValid;
  }
  onSave(){
    if (this.canSubmit()) {
      this.props.updateComment({
        id:this.state.id, //id, //: this.props.id,
        body: this.state.body.trim(),
        author: this.state.author,
        timestamp: Date.now(),   // supposed to update timestamp ?
      });
      this.closeModal();
    }
  }
  closeModal(){
    this.setState({id:'', body:'', author: '', isOpenModal: false});
    this.setState({
      touchedField: {
        body:   false,
        author: false,
      },
      validField: {
        body:   true,
        author: true,
      },
    });
  };
  onSubmit(e){
    e.preventDefault();
    // return false;
  }
  onEditComment(comment){
    // opens modal
      this.setState({
        id: comment.id,
        body: comment.body,
        author: comment.author,
        isOpenModal: true,
      });
  }

  render() {
    const { comments, postId } = this.props;

    if (postId === null) {
      // console.log('Comments, are null.');
      return (
        <div>Unable to get comments for this post</div>
      )
    }
    if (comments === []) {
      // console.log('There are no comments for this post.');
      return (
        <div>Be the first to comment on this post</div>
      )
    }

    const canSubmit = this.canSubmit();

    return  (
      <div>
        <hr />
        {comments.map((comment) => {
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
                    style={{
                      width: 75 + "%",
                      padding: "12px 20px",
                      margin:   "8px 0px",
                      display: "inline-block",
                      border:  "1px solid #ccc",
                    }}
                    type="text"
                    placeholder="Your comment.."
                    value={this.state.body}
                    onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
                    rows={'2'}
                    />
                </div>

                <div>
                  <p className="field-label-left">Author:</p>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={ (event) => {this.controlledAuthorField(event, event.target.value)} }
                    />
                </div>

                <button
                  className={canSubmit ? "on-save" : "has-invalid-field"}
                    onClick={canSubmit
                              ? ()  => {this.onSave()}
                              : (e) => {this.clickDisabled}
                            }
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

  const loc = getLoc(ownProps.routerProps) || null;
  // const loc = store.viewData.loc;

  // const postId = store.viewData.loc.postId  || null;
  const postId = loc && loc.postId;  // or loc.params.postId // or loc.postId
  // console.log('Comments, mSTP, loc', loc);

  const getSortedComments = createSelector(
    state => store.comments,
    (comments) => {
      return (
        Object.keys(comments)
        .reduce((acc, commentId) => {
          return acc.concat([store.comments[commentId]]);
         }, [])
        .filter((comment) => !comment.deleted && !comment.parentDeleted)
          // most recently edited/added to the top/start of the list
        .sort((commentA, commentB) => {
          if (commentA === commentB) return 0;
          if (commentA.timestamp < commentB.timestamp) return 1;
          return -1;
        })
      );
    }
  );
  const sortedComments = getSortedComments(store);

  return {
    postId,
    comments : sortedComments,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Comments);
