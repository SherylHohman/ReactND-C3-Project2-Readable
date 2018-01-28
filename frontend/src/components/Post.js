import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PostHeader from './PostHeader';
import Comments from './Comments';
import PropTypes from 'prop-types';
import changeView from '../state/viewData/ducks';

export class Post extends Component {

componentDidMount() {
  console.log('in Post componentDidMount');
  // TODO if page is loaded from saved url,
  //  fetch the post, based on post.id that's in the url

  // re-direct to home page if don't have the post (until implement above)

  // if (this.props.post === null) {
  //   <Redirect to="/" push />
  // }
  // else {console.log('post.id: ', this.props.post.id);}
}

  render(){

    const props = this.props;
    if (!props){console.log('Post props is undefined');}
    // else {console.log('props:', props);}

    const post =
      (props && props.post) ||
      (props && props.location && props.location.state && props.location.state.post) ||
      (props && props.match && props.match.params && props.match.params.post) ||
      null;

    // for exploring history when must rely on url
    if (props && props.location) {  // && props.location.state) {
      console.log('Post props.location');
    }
    if (props && props.match) {
      console.log('Post, url match', props.match);
    }


    // page probably loaded from saved url. Store is empty. Redirect
    // better solution would be to read the post id from the url.. fetch data.
    if (post === null) {
      console.log('Post: post wasn\'t present in props, redirecting to home page.');
      return (
        <div>
          <p>post wasn't present in props:</p>
          <Redirect to="/" push />
        </div>
      )
    }

    return (
      <div>
              <PostHeader post={post} />
              {/*<h2>{post.title}</h2>*/}
              <div> {post.body} </div>
              <div> Edit Post </div>
              <Comments />
              {/*<Comments postId={post.id} />*/}
      </div>
    );

  }
}

// const { object, func } = PropTypes;
Post.propTypes = {
  post: PropTypes.object//.isRequired,
}

function mapDispatchToProps(dispatch){
  return ({
    // getPosts: () => dispatch(fetchPosts()),
    // getPost: () => dispatch(fetchPost()),
    onChangeView: (url, selected) => dispatch(changeView({ url, selected }))
  })
}

function mapStoreToProps ( store ) {
  const postId = store.viewData.selected;
  const post = store.posts[postId] || null;

  // TODO read from url instead. Especially if post==null because of fresh page load.

  return {
    post,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Post);

 // export default PostDetail;



    // TODO "connect" this component, and IF post isn't in store, fetch it.
    // props post accessed by query string
    // https://github.com/ReactTraining/react-router/issues/4036

    // const { post } = props.location.state;
    // // prop passed in from a Link component
    // // https://stackoverflow.com/a/45599159/5411817

