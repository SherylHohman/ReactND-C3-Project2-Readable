import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPosts } from '../state/posts/ducks';

const PostHeader = function(props) {
  // const postId = props.postId;  // if turn into "smart" connect component
  const post = props.post;

  //  required to display (see project requirements) Ok, don't show id.
  const {title, category, voteScore, commentCount} = post;

  //  not required, but may like to include (at least on PostDetails),
  //  (maybe, maybe not on Home Page, listing of all posts)
  const {author, timestamp} = post;

  if (post.deleted) {
    // if user accesses this page through an old URL..
    console.log('Can\'t render Postheader of deleted post id:', post.id);
    return (
      <div><h2>This Post has been Deleted</h2></div>
    )
  };

  return  (
    <div>
      <div key={post.id}>
        <h2>{title}</h2>
        <div>votes: {voteScore} increment decrement</div>
        <p>{category}</p>
        <div>number of comments: {commentCount}</div>
        <hr />
      </div>
    </div>
  )
};

PostHeader.propTypes = {
  post: PropTypes.object.isRequired,       // if keep as a "dump" component
  // postId: PropTypes.string.isRequired,  // if turn into a connected comp
}


// export class PostHeader extends Component {

//   render(){

//   }
// }

// function mapDispatchToProps(dispatch){
//   return ({

//   })
// }

// function mapStoreToProps ( store, ownProps ) {
//   return {
//     post: ownProps.postId,
//   }
// };

// export default connect(mapStoreToProps, mapDispatchToProps)(PostHeader);

 export default PostHeader;
