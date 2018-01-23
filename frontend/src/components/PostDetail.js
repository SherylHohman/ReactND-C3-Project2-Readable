import React, { Component } from 'react';
// import { connect } from 'react-redux';
import PostHeader from './PostHeader';
import Comments from './Comments';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';  // TODO: DELETE - TEMP for

// import { connect } from 'react-redux';
// import { fetchPosts } from '../state/posts/ducks';

// ----------------------------------------

// const PostDetail = function(props) {
  // console.log('in PostDetail');
  // // const post = props.post;
  // // console.log('props:', props.post);

  // const post =
  //   (props && props.post) ||
  //   (props && props.location && props.location.state && props.location.state.post) ||
  //   (props && props.match && props.match.params && props.match.params.post) ||
  //   null;
  // // props post accessed by query string
  // // https://github.com/ReactTraining/react-router/issues/4036

  // // const { post } = props.location.state;
  // // // prop passed in from a Link component
  // // // https://stackoverflow.com/a/45599159/5411817

  // // TODO if not using store, and page is loaded from saved url,
  // //  fetch the post, based on post.id that's in the url
  // // TODO "connect" this component, and post isn't in store, fetch it.

  // if (!props){console.log('props is undefined');} else {console.log('props:', props);}
  // if (post !== null) {console.log('props', props, 'in PostDetail from Link in Posts')} else {console.log('post is null');}
  // if (props && props.match) {console.log('match', props.match);}

  // if (post === null) return (<div>post wasn't present in props</div>)

  // return (
  //   <div>
  //           <div> -- Post (Detail) Page: {post.body} -- </div>
  //           <Comments post={post} />
  //   </div>
  // );

  // // return  (
  // //   <div>
  // //     <PostHeader post={post} />
  // //     <div>post.body</div>
  // //     <Comments post={post} />
  // //   </div>
  // // )

// };

// PostDetail.propTypes = {
//   post: PropTypes.object.isRequired,
// }

// ----------------------------------------
export class PostDetail extends Component {

  render(){

    console.log('in PostDetail');

    const props = this.props;
    if (!props){console.log('props is undefined');} else {console.log('props:', props);}

    const post =
      (props && props.post) ||
      (props && props.location && props.location.state && props.location.state.post) ||
      (props && props.match && props.match.params && props.match.params.post) ||
      null;

    // props post accessed by query string
    // https://github.com/ReactTraining/react-router/issues/4036

    // const { post } = props.location.state;
    // // prop passed in from a Link component
    // // https://stackoverflow.com/a/45599159/5411817

    // TODO if not using store, and page is loaded from saved url,
    //  fetch the post, based on post.id that's in the url
    // TODO "connect" this component, and post isn't in store, fetch it.

    if (post !== null) {console.log('props', props, 'in PostDetail from Link in Posts')} else {console.log('post is null');}
    if (props && props.match) {console.log('match', props.match);}

    if (post === null) return (<div>post wasn't present in props:</div>)

    return (
      <div>
              <div> -- Post (Detail) Page: {post.body} -- </div>
              <Comments post={post} />
      </div>
    );

    // return  (
    //   <div>
    //     <PostHeader post={post} />
    //     <div>post.body</div>
    //     <Comments post={post} />
    //   </div>
    // )


  }
}
// ----------------------------------------

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
