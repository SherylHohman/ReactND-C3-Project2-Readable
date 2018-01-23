import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { connect } from 'react-redux';
// import { fetchPosts } from '../state/posts/ducks';


export class Comments extends Component {

  static propTypes = {
    post:PropTypes.object.isRequired,
  }

  render(){
    const { post } = this.props;
    console.log('this.props:', this.props, 'in Comments Component');

    //  TODO: need to know if post was deleted or not.
    //    do I pass in the entire post, or just post.id and post.deleted

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
  }

}

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
