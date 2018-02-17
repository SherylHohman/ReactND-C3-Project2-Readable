import React, { Component } from 'react';
import { addComment } from '../store/comments';
import { connect } from 'react-redux';
import { createId, titleCase } from '../utils/helpers';
// import PropTypes from 'prop-types';


export class NewComment extends Component {

  state = {
    body   : '',
    author : '',  // TODO auto fill by logged in User
  }

  controlledBodyField(e, currentText){
    this.setState({body: currentText});
  }
  controlledAuthorField(e, currentText){
    this.setState({author: titleCase(currentText)});
  }

  onSave(){
    //  sending only changed values, rather than the whole post, hence the name
    const newCommentData = {
      id: createId(),
      parentId: this.props.postId,
      timestamp: Date.now(),
      body: this.state.body.trim() || '(no comment)',
      author: this.state.author.trim() || '(anonymous)',
    }
    // console.log(newCommentData);
    this.props.onSave(newCommentData);
    this.resetFormFields();
  }

  onCancel(){
    this.resetFormFields();
  }

  resetFormFields(){
    this.setState({body: '', author: ''});
  }

  onSubmit(e){
    e.preventDefault();
    return false;
  }


  render(){

    return(
      <div
          style={{width:"60%", margin:"0 auto"}}
      >
        <h3>Your Comment:</h3>
        <form onSubmit={(e)=> {this.onSubmit(e)}}>

          <textarea
            className="comment-body"
            type="text"
            placeholder="Your insightful comment.."
            value={this.state.body}
            onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
            rows={'2'}
            />

          <input
            className="comment-author"
            type="text"
            placeholder="Your Name.."
            value={this.state.author}
            onChange={ (event) => {this.controlledAuthorField(event, event.target.value)} }
            /* TODO: add user field on Home/Page, that auto populates author field */
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
    )
  }

}

function mapDispatchToProps(dispatch){
  return ({
    onSave: (newCommentData) => dispatch(addComment(newCommentData)),
  })
}

function mapStoreToProps ( store, ...ownProps ) {
  return {
    postId : store.viewData.currentId,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(NewComment);




