import React, { Component } from 'react';
// import { connect } from 'react-redux';
import PostHeader from './PostHeader';
import Comments from './Comments';
import PropTypes from 'prop-types';

// import { connect } from 'react-redux';
// import { fetchPosts } from '../state/posts/ducks';

const PostDetail = function(props) {
  // const post = props.post;
  console.log('props', props, 'in PostDetail from Link in Posts');

  // const { post } = props.location.state;
  // // props post accessed by query string
  // // https://github.com/ReactTraining/react-router/issues/4036

  const { post } = props.location.state;
  // prop passed in from a Link component
  // https://stackoverflow.com/a/45599159/5411817


  console.log('props:', props);

  return  (
    <div>
      <PostHeader post={post} />
      <div>post.body</div>
      <Comments post={post} />
    </div>
  )
};

PostHeader.propTypes = {
  post:PropTypes.object.isRequired,
}


// export class PostDetail extends Component {

//   render(){

//   }
// }

// function mapDispatchToProps(dispatch){
//   return ({

//   })
// }

// function mapStoreToProps ( store ) {
//   return {
//     ...store,
//   }
// };

// export default connect(mapStoreToProps, mapDispatchToProps)(PostDetail);

 export default PostDetail;
