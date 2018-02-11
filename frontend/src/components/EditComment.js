import React, { Component } from 'react';
import { editComment } from '../store/comments';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

// NOT USING !
// export
class EditComment extends Component {
  state = {
    body: '',
  }

  componentDidMount(){
    console.log('cDM, props:', this.props);
    if (this.props && this.props.body){
    // if (this.props && this.props.comment){
      // this.setState({ body: this.props.comment.body });
      this.setState({ body: this.props.body });
    }
  }

  controlledBodyField(e, currentText){
    e.preventDefault();
    this.setState({body: currentText});
  }

  onSave(){
    this.props.saveComment({
      id:this.props.comment.id, //id, //: this.props.id,
      body: this.state.body.trim(),
      timestamp: Date.now(),   // supposed to update timestamp ?
    });
    this.props.closeModal();
  }
  onCancel(){
    this.props.closeModal();
  }
  onSubmit(e){
    e.preventDefault();
    // return false;
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
    // closeModal: () => dispatch();
  })
}

function mapStoreToProps (store, ownProps) {
  console.log('ownProps:', ownProps);
  // console.log('store.comments[ownProps.commentId]:', store.comments[ownProps.commentId]);
  console.log('store.comments[ownProps.comment]:', store.comments[ownProps.comment]);
  return {
    // comment: store.comments[ownProps.commentId],
    // body: store.comments[ownProps.commentId].body,
    // id: ownProps.commentId,
    body: store.comments[ownProps.comment.id].body,
    id: ownProps.comment.id,
  }
};


// export default connect(mapStoreToProps, mapDispatchToProps)(EditComment);
export default connect(null, mapDispatchToProps)(EditComment);

