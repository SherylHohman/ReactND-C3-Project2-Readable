 import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import { ROUTES } from '../store/viewData';
import { changeView, getUri } from '../store/viewData';
import { upVotePost, downVotePost, deletePost, fetchPost } from '../store/posts';
import { dateMonthYear } from '../utils/helpers';
import PropTypes from 'prop-types';

export class Post extends Component {

  componentDidMount() {
    console.log('in Post componentDidMount, props:', this.props);

    if (this.props.postId && !this.props.post){
      this.props.fetchPost(this.props.postId);
    }

    if (this.props.uri){
      this.props.changeView(this.props.uri)
    }
  }

  componentWillReceiveProps(nextProps){
    // maybe check for 404 (deleted postId, bad postId), or network error here ?
  }

  render(){

    if (!this.props){console.log('Post props is undefined');}

    // TODO: show error message if error fetching post:
    //  post Deleted, bad PostId, or network error
    //  options: 404, retry, homePage

    if (!this.props.post) {
      // console.log('Post: post wasn\'t present in props, do I have the postID?:', this.props.postId);
      return (
        <div>
          <p>looking for your Post:</p>
        </div>
      )
    }

    const postId = this.props.postId;
    const {title, body, voteScore, commentCount, author, timestamp } = this.props.post;

    // disambiguate:
    // category is an {name, path} object on categories, yet
    // category on a post refers to a category.name
    const categoryName = this.props.post.category;

    return (
      <div>
        <div>
            <Link to={`${ROUTES.post.base}${postId}`}>
              <h2>{title}</h2>
            </Link>

            <div>
              <div className="post-body">
                {body}
              </div>
              <p> </p>

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
            </div>

            <p>Category: {categoryName} | By: {author} | On: {dateMonthYear(timestamp)}</p>

            <div>
              <Link
                to={`${ROUTES.category.base}${this.props.categoryPath}`}
                onClick={() => {this.props.deletePost(postId)}}
              >
                Delete Post
              </Link>
                <Link to={`${ROUTES.editPost.base}${postId}`}>
                  Edit Post
                </Link>
            </div>
        </div>
        <hr />
        <h3>{commentCount} Comments</h3>
        <Comments routerProps={ this.props.routerProps } />
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
    onUpVotePost:   (postId) => dispatch(upVotePost(postId)),
    onDownVotePost: (postId) => dispatch(downVotePost(postId)),

    deletePost: (postId) => dispatch(deletePost(postId)),
    changeView: (uri) => dispatch(changeView({ uri })),

    fetchPost:  (id) => dispatch(fetchPost(id)),
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('Post store:', store);
  // console.log('Post ownProps:', ownProps);

  const uri = getUri(ownProps.routerProps) || null;
  const postId = uri.postId  || null;
  const post = store.posts[postId] || null;

  // so can redirect to Post's (former) category when deleting the post
  const categoryName = (post && post.category) || null;
  const category  = categoryName && store.categories[categoryName];
  const categoryPath = (category && store.categories[categoryName].path) || null //HOME.category.path || null;

  return {
    postId,
    post,

    // ref to the url of this post's category
    categoryPath,

    // view data data stored in url's - keep data in synch w/ browser url
    uri,

    // so don't have to refactor history.push references
    // history: ownProps.routerProps.history
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Post);
