import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import { changeView } from '../store/viewData';
import { upVotePost, downVotePost, deletePost } from '../store/posts';
import { dateMonthYear } from '../utils/helpers';
import { pullFromStore, l } from '../utils/helpers';
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

  onDelete(postId){
    // must call deletePost before changeView
    this.props.deletePost(postId);
    // Link redirects to category that this post previously appeared
    // viewData musht store this same info to keep in synch
    // Not Dry :/ - TODO: read and parse data from URL routes
    const category = {
      name: this.props.post.category,
      path: this.props.categoryPath,
    }
    console.log(category);
    this.props.changeViewByCategory(category);
  }

  render(){

    const props = this.props;
    if (!this.props){console.log('Post props is undefined');}

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
    const {title, voteScore, commentCount, author, timestamp } = this.props.post;

    // disambiguity:
    // category is also an object (on store.categories array),
    // the category field on a post is a category.name
    const categoryName = this.props.post.category;

    return (
      <div>
        <div>
            <Link
              to={`/post/${postId}`}
              onClick={() => {this.props.onChangeView(`/post/${postId}`, postId)
            }}>
              <h2>{title}</h2>
            </Link>

            <p>Category: {categoryName} | By: {author} | On: {dateMonthYear(timestamp)} |
              <Link
                to={`/post/${postId}/edit`}
                onClick={() => {this.props.onChangeView(`/post/${postId}/edit`, postId)
              }}>
                Edit Post
              </Link>
            </p>

            <div className="vote">
              <div
                className="post-up-vote"
                onClick={() => {this.props.onUpVotePost(postId)}}>
              </div>
              <h2>{voteScore}</h2>
              <div
                className="post-down-vote"
                onClick={() => {this.props.onDownVotePost(postId)}}>
              </div>
            </div>

            <Link
              to={`/category/${this.props.categoryPath}`}
              onClick={() => {this.onDelete(postId)}}
            >
              Delete Post
            </Link>
        </div>

        <div> {post.body} </div>
        <hr />
        <h3>{commentCount} Comments</h3>
        <Comments />
      </div>
    );

  }
}

// TODO: how to use PropTypes ".isRequired" with redux store?
// const { object, func } = PropTypes;
Post.propTypes = {
  post: PropTypes.object//.isRequired,
}

function mapDispatchToProps(dispatch){
  return ({
    onChangeView:  (url, id) => dispatch(changeView({ url, id })),
    onUpVotePost:   (postId) => dispatch(upVotePost(postId)),
    onDownVotePost: (postId) => dispatch(downVotePost(postId)),

    changeViewByCategory: (category) => dispatch(changeView({ category })),
    deletePost: (postId) => dispatch(deletePost(postId)),
  })
}

function mapStoreToProps ( store ) {
  const postId = store.viewData.id;
  const post = store.posts[postId] || null;

  // post.category is a categoryName
  // grab it's path from the categories object

  const categoriesArray = Object.keys(store.categories)
    .reduce((acc, categoryKey) => {
      return acc.concat([store.categories[categoryKey]]);
    }, []);

  const categoryPath = categoriesArray
    .find(categoryId => (categoryId.name === post.category))
    .path;

  // TODO read from url instead. Especially if post==null because of fresh page load.

  return {
    post,
    categoryPath,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Post);




    // TODO IF post isn't in store, fetch it.
    // props post accessed by query string
    // https://github.com/ReactTraining/react-router/issues/4036

    // const { post } = props.location.state;
    // // prop passed in from a Link component
    // // https://stackoverflow.com/a/45599159/5411817

