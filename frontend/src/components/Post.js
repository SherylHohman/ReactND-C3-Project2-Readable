import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import { ROUTES, HOME } from '../store/viewData';
import { changeView, getLoc } from '../store/viewData';
import { upVotePost, downVotePost, deletePost, fetchPost } from '../store/posts';
import { dateMonthYear, titleCase } from '../utils/helpers';
import PropTypes from 'prop-types';

export class Post extends Component {

  componentDidMount() {
    // console.log('Post.cDM, props:', this.props);

    if (this.props.postId && !this.props.post){
    //   console.log('Post.cDM ..fetching, post for postId:', this.props.postId);
      this.props.fetchPost(this.props.postId);
    }

    if (this.props.routerProps){
      // console.log('Post.cDM calling changeView, post with routerProps:', this.props.routerProps);
      this.props.changeView(this.props.routerProps)
    }
    // else {
      // console.log('Post.cDM _NOT_ calling changeView, post for routerProps:', this.props.routerProps);
    // }
  }

  disableClick(e){
    e.preventDefault();
  }

  render(){

    // console.log('Post.render fetchStatus', this.props.fetchStatus);
    const { isLoading, isFetchFailure } = this.props.fetchStatus;
    const postId = this.props.postId;

    if (isFetchFailure) {
      // console.log('Post: isFetchFailure, postId', this.props.postId);
      return (
        <div>
          <p>I could not retrieve that post.</p>
          <p>Either that post does not exist..</p>
          <p>..or there was a network error.</p>
          <hr />
          {/**/}
          <Link to={HOME.url}>Home Page</Link>
          <button onClick={() => {this.props.fetchPost(postId)}}>Retry</button>
          {/**/}
        </div>
      )
    }

    if (isLoading) {
      // console.log('Post: Loading.. postID:', this.props.postId);
      return (
        <div>
          <p>looking for your Post..</p>
        </div>
      )
    }

    if (!this.props.post) {
      // console.log('Post: no post data. Has FETCH POST been initiated?: post wasn\'t present in props, postID?:', this.props.postId);
      return (
        <div>
          <p>First render should have initiated a fetch..</p>
          <p>..but then either "isLoading" or "isFetchFailure" should kick in</p>
          <p><i>Should't get this far.. (why was there no early return??)</i></p>
          <p>Post: post wasn\'t present in props, do I have the postID?: {postId}</p>
        </div>
      );
    }

    // only set these constants After early return for non-existant this.props.post (isLoading, or isFetchFailure)
    const {title, body, voteScore, commentCount, author, timestamp } = this.props.post;

    // disambiguate category --> categoryName:
    // category is an {name, path} object on categories, yet
    // category on a post refers to a category.name
    const categoryName = this.props.post.category;

    return (
      <div>
        <div>
            <Link to={`${ROUTES.post.base}${categoryName}/${postId}`}
                  onClick={this.disableClick}
                  style={{cursor:"default"}}
              >
              <h2 className="selected">{title}</h2>
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

            <p>category: {titleCase(categoryName)} | by: {author}, {dateMonthYear(timestamp)}</p>

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
    changeView: (routerProps) => dispatch(changeView(routerProps)),

    fetchPost:  (id) => dispatch(fetchPost(id)),
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('Post store:', store);
  // console.log('Post ownProps:', ownProps);

  const loc = getLoc(ownProps.routerProps) || null;
  // const loc = store.viewData.loc;
  const postId = loc.postId;  // === store.viewData.loc.postId; //loc.postId  || null;
  const post = store.fetchedPosts.posts[postId] || null;
  // console.log('Post.mSTP, post', post, 'posts', store.fetchedPosts.posts);

  // const fetchStatus = {
  //   isLoading:      store.posts.isLoading,
  //   isFetchFailure: store.posts.isFetchFailure,
  //   errorMessage:   store.posts.errorMessage,
  // }
  const fetchStatus = store.fetchedPosts.fetchStatus;
  // console.log('Post.mSTP, post', fetchStatus, 'posts', fetchStatus);

  // so can redirect to Post's (former) category when deleting the post
  const categoryName = (post && post.category) || null;
  const category     = categoryName && store.categories[categoryName];
  const categoryPath = (category && store.categories[categoryName].path) || null
        //HOME.category.path || null;

  return {
    fetchStatus,
    postId,
    post,
    categoryPath,  // ref to the url of this post's category
    loc,           // data parsed from Browser Url
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Post);
