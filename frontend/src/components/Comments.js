import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchComments } from '../state/comments/ducks';


export class Comments extends Component {

  static propTypes = {
    post:PropTypes.string//.isRequired,
  }

  componentDidMount(){
    const postId = this.props.postId;
    console.log('...in Comments ComponentDidMount, props', this.props);
    console.log('postId', postId, 'comments', this.props.comments);

    // if (postId !== null){
      console.log('getComments..');
      this.props.getComments(postId);
    // } else {
      // console.log('Comments, postId === null');
    // }
  }

  render() {
    console.log('render comments - this.props.postId:, comments:', this.props.postId, comments, 'in Comments Component');
    const { comments, postId } = this.props;

    if (postId === null) {
      console.log('Comments, are null.');
      return (
        <div>Unable to get comments for this post</div>
      )
    }
    if (comments === []) {
      console.log('Comments, are null.');
      return (
        <div>Be the first to comment on this post</div>
      )
    }

    //  TODO: need to know if post was deleted or not.
    //    do I pass in the entire post, or just post.id and post.deleted

    // if (post.deleted) {
    //   return (
    //     <div>
    //       <h3> ..Oops! This post has been deleted.</h3>
    //       <p>No comments to show.</p>
    //     </div>
    //   )
    // }

    return  (

      <p> ---Comments Component--- </p>
      // TODO: only render undeleted comments
    )
  }

}

function mapDispatchToProps(dispatch){
  return ({
    getComments: (postId) => dispatch(fetchComments(postId)),
  })
}

function mapStoreToProps ( store ) {
  console.log('in mapStoreToProps');

  const postId = store.viewData.selected || null;

  //  TODO: double check that if there is a comments array in store ,
  //    it is for *this* post

  // turn object of comment objects into array of comment objects (for react mapping)
  const commentIds = Object.keys(store.comments);
  const comments = commentIds.reduce((acc, commentId) => {
    return acc.concat([store.comments[commentId]]);
  }, []);

  console.log('postId;', postId, '\ncommentsIds', commentIds, '\ncomments', comments);

  return {
    postId,
    comments,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Comments);

 // export default Comments;
