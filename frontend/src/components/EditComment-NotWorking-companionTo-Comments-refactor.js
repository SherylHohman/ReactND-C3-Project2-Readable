// CURRENTLY THIS CODE IS EMBEDDED IN COMMENTS.js
// DON'T USE THIS FILE
// HAVEN'T GOTTEN MODAL TO WORK AS EXTERNAL FILE
// COMMENTS-refactor-callsEditComment-NotWorking.js is
//   The WIP version of Comments that *should* work with *this* code
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { editComment } from '../store/comments/actionCreators';
import { titleCase } from '../utils/helpers';
// import PropTypes from 'prop-types';

// NOT USING - NOT WORKING AS SEPARATE COMPONENT !
// TO BE USED IN CONJUNCTION WITH THE CODE IN  Comments-tryingToSeparate...
export class EditComment extends Component {
  state = {
    // isOpenModal: false,
    // id: '',
    body: '',
    author: '',
  };

  componentDidMount(){
    // console.log('cDM, props:', this.props);
    if (this.props && this.props.comment){
    // if (this.props && this.props.comment){
      // this.setState({ body: this.props.comment.body });
      this.setState({
        body: this.props.comment.body,
        author: this.props.comment.author
      });
    }
  }

  controlledBodyField(e, currentText){
    e.preventDefault();
    this.setState({body: currentText});
  }
  controlledAuthorField(e, currentText){
    e.preventDefault();
    this.setState({author: titleCase(currentText)});
  }

  onSave(){
    this.props.updateComment({
      id:this.props.comment.id, //id, //: this.props.id,
      body: this.state.body.trim(),
      author: this.state.author,
      timestamp: Date.now(),   // supposed to update timestamp ?
    });
    this.props.closeModal();
  }
  onCancel(){
    this.props.closeModal();
  }
  // closeModal(){
  //   this.setState({id:'', body:'', author: '', isOpenModal: false});
  // };
  onSubmit(e){
    e.preventDefault();
    // return false;
  }

  render() {

    return (
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
    saveComment: (editedCommentData) => {
      dispatch(editComment(editedCommentData))
    },
    // closeModal: () => dispatch(this.props.closeModal());
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('ownProps:', ownProps);
  // console.log('store.comments[ownProps.comment]:', store.comments[ownProps.comment]);
  // console.log('store.comments[ownProps.commentId]:', store.comments[ownProps.commentId]);
  const id = ownProps.comment.id
  return {
    // comment: store.comments[ownProps.commentId],
    // body: store.comments[ownProps.commentId].body,
    // id: ownProps.commentId,
    id,
    body: store.comments[id].body,
    author: store.comments[id].author,
  }
};


// export default connect(mapStoreToProps, mapDispatchToProps)(EditComment);
export default connect(null, mapDispatchToProps)(EditComment);

