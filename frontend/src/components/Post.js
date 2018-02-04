import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import { changeView } from '../store/viewData';
import { upVotePost, downVotePost } from '../store/posts';
import { dateMonthYear } from '../utils/helpers';
import PropTypes from 'prop-types';

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


    // If page is loaded from a saved url. Store is empty. Redirect
    // A better solution would be to read the post id from the url.. fetch data.
    if (post === null) {
      console.log('Post: post wasn\'t present in props, redirecting to home page.');
      return (
        <div>
          <p>post wasn't present in props:</p>
          <Redirect to="/" push />
        </div>
      )
    }

    const postId = props.post.id;  // change to == post.id ?  //see above, and below.
    const {title, category, voteScore, commentCount} = props.post;  // change to =post ?
    const {author, timestamp} = post;

    return (
      <div>
        <div>
            <Link
              to={`/post/${postId}`}
              onClick={() => {props.onChangeView(`/post/${postId}`, postId)
            }}>
              <h2>{title}</h2>
            </Link>

            <p>Category: {category} | By: {author} | On: {dateMonthYear(timestamp)} | 
              <Link
                to={`/post/${postId}/edit`}
                onClick={() => {props.onChangeView(`/post/${postId}/edit`, postId)
              }}>
                Edit Post
              </Link>
            </p>

            <div className="vote">
              <div
                className="post-up-vote"
                onClick={() => {props.onUpVotePost(postId)}}>
              </div>
              <h2>{voteScore}</h2>
              <div
                className="post-down-vote"
                onClick={() => {props.onDownVotePost(postId)}}>
              </div>
            </div>
        </div>

        <div> {post.body} </div>
        <hr />
        <h3>{commentCount} Comments</h3>
        <Comments />
      </div>
    );

  }
}

// TODO: how to use PropTypes with redux store?
// const { object, func } = PropTypes;
Post.propTypes = {
  post: PropTypes.object//.isRequired,
}

function mapDispatchToProps(dispatch){
  return ({
    onChangeView: (url, selected) => dispatch(changeView({ url, selected })),
    onUpVotePost:   (postId) => dispatch(upVotePost(postId)),
    onDownVotePost: (postId) => dispatch(downVotePost(postId)),
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




    // TODO "connect" this component, and IF post isn't in store, fetch it.
    // props post accessed by query string
    // https://github.com/ReactTraining/react-router/issues/4036

    // const { post } = props.location.state;
    // // prop passed in from a Link component
    // // https://stackoverflow.com/a/45599159/5411817

