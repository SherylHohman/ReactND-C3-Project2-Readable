import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// dispatch functions
import { changeView, getLoc } from '../store/viewData';
import { upVotePost, downVotePost, deletePost, fetchPost } from '../store/posts';

// Components
import Comments from './Comments';
import FetchStatus from './FetchStatus';

// Selectors
import { getPostsAsObjects, getFetchStatus } from '../store/posts';

// helpers and constants
import { computeUrlFromParamsAndRouteName } from '../store/viewData';
import { dateMonthYear, titleCase } from '../utils/helpers';
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

  disableClick(e){
    e.preventDefault();
  }

  render(){
    // console.log('Post.render fetchStatus', this.props.fetchStatus);
    const postId = this.props.postId;

    if (!this.props.post) {
      // loading "spinner", fetch failure, or 404
      return (
        <FetchStatus routerProps={ this.props.routerProps }
          fetchStatus={this.props.fetchStatus}
          label={'post'}
          item={this.props.post}
          retryCallback={()=>this.props.fetchPost(postId)}
        />
      );
    }

    // Set these constants After early return for non-existant post
    const {title, body, voteScore, commentCount, author, timestamp } = this.props.post;

    // disambiguate category --> categoryName:
    // category is an {name, path} object on categories, yet
    // category on a post refers to a category.name
    const categoryName = this.props.post.category;

    const makeUrl = (routeName) => {
      // console.log('Post.render.makeUrl, routeName:', routeName, ', props:', this.props);
      let params = {};
      switch (routeName){
        case 'editPost':
          if (!this.props || !this.props.postId){
            console.log('ERROR: Post.render.makePostUrl Missing "postId", props:', this.props);
            return null;
          }
          params = {
            postId: this.props.postId,
          }
          return computeUrlFromParamsAndRouteName(params, routeName);

        case 'category':
          if (!this.props || !this.props.categoryPath){
            console.log('ERROR: Post.render.makeCategoryUrl Missing "categoryPath", props:', this.props);
            return null;
          }
          params = {
            categoryPath: this.props.categoryPath,
          }
          return computeUrlFromParamsAndRouteName(params, routeName);

        case 'post':
          if (!this.props || !this.props.postId || !this.props.categoryPath){
            console.log('ERROR: Post.render.makePostUrl Missing "postId" or "categoryPath", props:', this.props);
            return null;
          }
          params = {
            postId: this.props.postId,
            categoryPath: this.props.categoryPath,
          }
          return computeUrlFromParamsAndRouteName(params, routeName);

        default:
          console.log('ERROR: Post.render.makeUrl, defaulting. Unknown routeName:', routeName);
          return null;
      }
    }

    // console.log('Posts.render, props:', this.props);
    return (
      <div>
        <div>
            <Link to={makeUrl('post')}
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
              <Link to={makeUrl('category')}
                    onClick={() => {this.props.deletePost(postId)}}
                >
                Delete Post
              </Link>

              <Link to={makeUrl('editPost')}
                >
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

  //  call getLoc from routerProps RATHER THAN store.viewData.loc
  //    to get most up-to-date postId here
  //    rather than wait for cDM to call updateView and store to asynch update
  //    store.viewData.loc (url,postId,categoryPath,..) to the current Page
  //    based on routerProps info.
  //  Optimization:
  //    uses routerProps to get infor for CURRENT browser Url
  //    rather than the one saved to store
  //    This is because routerProps is the source of truth for this component
  //    (since component ONLY renders on EXACT match)
  //  This is because at componentDidMount, store has the url of the PREVIOUS
  //    page.  cDM THEN calls changeView to UPDATE store to make it in synch
  //    with the current browser url..
  //  Which would then re-trigger a re-render with the updated (correct) url.
  //  Instead, set component props using router's url, so loc doesn't change
  //    after store's url is updated, cuz it *already* had the new value.

  // const loc = store.viewData.loc;
  const loc = getLoc(ownProps.routerProps) || null;
  const postId = loc.postId;   // *always* Exists on *this* page/component/route

  const post = getPostsAsObjects(store)[postId] || null;
  const fetchStatus = getFetchStatus(store);

  // So can easily redirect to Post's (former) category when deleting the post.
  const categoryPath = loc.categoryPath || null;

  return {
    post,
    postId,
    categoryPath,
    fetchStatus,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Post);
