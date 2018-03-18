import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { ROUTES, HOME } from '../store/viewData';
import { changeView, getLoc } from '../store/viewData';

import { upVotePost, downVotePost, deletePost, fetchPost } from '../store/posts';
import { dateMonthYear, titleCase } from '../utils/helpers';

import Comments from './Comments';
import PageNotFound from './PageNotFound';
import { getPostsAsObjects, getFetchStatus } from '../store/posts';
import PropTypes from 'prop-types';

export class Post extends Component {

  componentDidMount() {
    // console.log('Post.cDM, props:', this.props);

    if (this.props.routerProps){
      // console.log('Post.cDM calling changeView, post with routerProps:', this.props.routerProps);
      this.props.changeView(this.props.routerProps)
    }

    if (this.props.postId && !this.props.post){
    //   console.log('Post.cDM ..fetching, post for postId:', this.props.postId);
      this.props.fetchPost(this.props.postId);
    }
  }

  // componentWillReceiveProps(nextProps){
  //   if (nextProps.postId && nextProps.postId !== this.props.postId){
  //     //   console.log('Post.wRP ..fetching, post for postId:', this.props.postId);
  //     this.props.fetchPost(this.props.postId);
  //   }
  //   if (nextProps.routerProps &&
  //      (nextProps.routerProps !== this.props.routerProps)){
  //     this.props.changeView(this.props.routerProps)
  //   }
  // }

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
      return (
        <PageNotFound routerProps={ this.props.routerProps } />
      );
    }

    // only set these constants After early return for non-existant this.props.post (isLoading, or isFetchFailure)
    const {title, body, voteScore, commentCount, author, timestamp } = this.props.post;

    const categoryName = this.props.post.category;
    // disambiguate category --> categoryName:
    // category is an {name, path} object on categories, yet
    // category on a post refers to a category.name

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

  //  Either call getLoc from routerProps to get most up-to-date postId
  //    here, and call fetch from componentDidMount
  // NOPE: DOESNT WORK: OR get loc directly from store, let componentDidMount update loc
  //      using routerProps, but WAIT to call Fetch from componentWillReceiveProps
  //      as postId may change in the process, and we don't want to make an
  //      unnecessary network request on the postId, only to immediately make another
  //      request with the correct postId.
  //  Not sure which is considered best practice.
  //  It does not seem quite right to not use store to retrieve loc,
  //    Then again, router *is* the source of truth, and I'm simply keeping store
  //    in synch with router..

  // const loc = store.viewData.loc;
  const loc = getLoc(ownProps.routerProps) || null;
  const postId = loc.postId;

  const post = getPostsAsObjects(store)[postId] || null;
  const fetchStatus = getFetchStatus(store);
  // (isLoading, isFetchFailure, errorMessage)

  // get his post's categoryPath so can redirect to Post's (former) category
  //   when deleting the post. Here I have access to store.categories, which
  //   is only used as an intermediate step for this one-time calc.
  const categoryName = (post && post.category) || null;
  const category     = categoryName && store.categories[categoryName];
  const categoryPath = (category    && store.categories[categoryName].path) || null

  return {
    postId,
    post,
    categoryPath,
    fetchStatus,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Post);
