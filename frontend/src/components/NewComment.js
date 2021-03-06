import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addComment }  from '../store/comments/actionCreators';
// import { getPostFrom } from '../store/posts/selectors';
import { getPostIdFrom } from '../store/posts/selectors';
import { createId, titleCase } from '../utils/helpers';


export class NewComment extends Component {

  state = {
    body   : '',
    author : '',   // TODO auto fill viA logged in User
    validField: {
      author: false,
      body:   false,
    },
  }

  canSubmit(){
    const keys = Object.keys(this.state.validField);
    return keys.every((key) => {
      return this.state.validField[key];
    })
  }
  validateField(key, newText){
    // setState is async, so cannot use state's value for this field
    // hence validating on newText (the value setState is setting the field to)

    const isValid = !!newText;  // !! empty string, null, undefined

    this.setState({
      validField: {
        ...this.state.validField,
        [key]: isValid,
      }
    });
  }

  controlledBodyField(e, currentText){
    this.setState({body: currentText});
    this.validateField('body', currentText)
  }
  controlledAuthorField(e, currentText){
    this.setState({author: titleCase(currentText)});
    this.validateField('author', currentText)
  }

  disableClick(e){
    e.preventDefault();
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
    this.props.onSave(newCommentData);
    this.resetFormFields();
  }

  onCancel(){
    this.resetFormFields();
  }

  resetFormFields(){
    this.setState({body: '', author: ''});
    this.setState({
      validField: {
        author: false,
        body:   false,
      }
    });
  }

  onSubmit(e){
    e.preventDefault();
    return false;
  }


  render(){
    // console.log('NewComment.render, re-rendering..');  // monitor for unnecessary re-renders

    const canSubmit = this.canSubmit();

    return(
      <div
          style={{width:"60%", margin:"0 auto"}}
      >
        <h3>Your Comment:</h3>
        <form onSubmit={(e)=> {this.onSubmit(e)}}>

          <textarea
            style={{width:"87%"}}
            type="text"
            placeholder="Your insightful comment.."
            value={this.state.body}
            onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
            rows={'2'}
            />

          <input
            type="text"
            placeholder="Your Name.."
            value={this.state.author}
            onChange={ (event) => {this.controlledAuthorField(event, event.target.value)} }
            /* TODO: add user field on Home/Page, that auto populates author field */
            />

          <button
            className={canSubmit ? "on-save" : "has-invalid-field"}
              onClick={canSubmit
                        ? ()  => {this.onSave()}
                        : (e) => {this.disableClick}
                      }
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

NewComment.propTypes = {
  onSave: PropTypes.func.isRequired,
}

function mapDispatchToProps(dispatch){
  return ({
    onSave: (newCommentData) => dispatch(addComment(newCommentData)),
  })
}

function mapStoreToProps ( store, ownProps ) {
  return {
    postId: getPostIdFrom(store, null),
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(NewComment);
