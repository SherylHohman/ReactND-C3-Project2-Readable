import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { connect } from 'react-redux';
// import { fetchPosts } from '../state/posts/ducks';

const Comments = function(props) {
  const { post } = props;
  console.log('props:', props, 'in Comments Component');

  //  TODO: need to know if post was deleted or not.
  //    do I send in the entire post, or just post.id, post.deleted

  if (post.deleted) {
    return (
      <div>
        <h3> ..Oops! This post has been deleted.</h3>
        <p>No comments to show.</p>
      </div>
    )
  }

  return  (

    <p> ---Comments Component--- </p>
    // TODO: only render undeleted comments
  )
};

Comments.propTypes = {
  post:PropTypes.object.isRequired,
}

// export class Comments extends Component {

//   render(){

//   }
// }

// function mapDispatchToProps(dispatch){
//   return ({

//   })
// }

// function mapStoreToProps ( store ) {
//   return {

//   }
// };

// export default connect(mapStoreToProps, mapDispatchToProps)(Comments);

 export default Comments;
