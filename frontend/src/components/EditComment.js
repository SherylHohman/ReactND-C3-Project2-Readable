import React, { Component } from 'react';
import { editComment } from '../store/comments';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

export class EditComment extends Component {
  state = {
    body   : '',
  }

  componentDidMount(){
    this.setState({ body: this.props.comment.body });
  }

  controlledBodyField(e, currentText){
    this.setState({body: currentText});
  }
  controlledAuthorField(e, currentText){
    this.setState({author: currentText});
  }
  onSaveComment(id){
    this.props.saveComment({
      id,
      body: this.state.commentBody.trim(),
      timestamp: Date.now(),   // supposed to update timestamp ?
    });
  }

  render() {

    return (
      <div>
        <form onSubmit={(e)=> {this.onSubmit(e)}}>

          <textarea
            className="comment-body"
            type="text"
            placeholder="Your insightful comment.."
            value={this.state.body}
            onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
            style={{width:'100%'}}
            rows={'2'}
            />

          <button
            className="on-save"
            onClick={() => {this.onSave();}}
            >
            Save
          </button>
          <button
            className="on-cancel"
            onClick={() => {this.onCancel();
          }}>
            Cancel
          </button>
        </form>
      </div>
    );
  }

}


function mapDispatchToProps(dispatch){
  return ({
    saveComment: (commentId, editedCommentData) => {
      dispatch(editComment(commentId, editedCommentData))
    },
  })
}

function mapStoreToProps (store, ownProps) {
  return {
    comment: store.comments[ownProps.commentId],
  }
};


export default connect(mapStoreToProps, mapDispatchToProps)(EditComment);

