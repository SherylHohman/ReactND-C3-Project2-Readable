import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// dispatch Action Creators
import { fetchPosts } from '../store/posts';
import { changeView, getLoc, changeSort } from '../store/viewData';
import { upVotePost, downVotePost, deletePost } from '../store/posts';

// Components
import FetchStatus from './FetchStatus';

// Selectors
import { getPostsCurrentCategory, getFetchStatus } from '../store/posts';
import { getValidCategoryUrls, getCategoriesObject } from '../store/categories';

// Actions and Constants, and helpers
import { ROUTES, computeUrlFromParamsAndRouteName } from '../store/viewData';
import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER} from '../store/viewData';
import { dateMonthYear, titleCase } from '../utils/helpers';


export class Posts extends Component {

  state = {
    posts: [],
    sortBy: DEFAULT_SORT_BY,
    sortOrder: DEFAULT_SORT_ORDER,
  }

  componentDidMount() {
    // loc and categoryPath already reflect the value from routerProps as per mapStoreToProps
    this.props.changeView(this.props.routerProps);
    this.props.fetchPosts(this.props.categoryPath);

    this.setState({ sortBy: this.props.sortBy });
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.sortBy !== this.props.sortBy) {
      const posts = nextProps.posts || this.props.posts;
      const sortedPosts = sortPosts(posts, nextProps.sortBy);
      this.setState({
        posts:  sortedPosts,
        sortBy: nextProps.sortBy,
      });
    }
    else if (nextProps.posts !== this.props.posts) {
      const sortedPosts = sortPosts(nextProps.posts, this.state.sortBy);
      this.setState({ posts: sortedPosts });
    }

    if ((nextProps.routerProps  && this.props.routerProps) &&
        (nextProps.routerProps !== this.props.routerProps)){
      this.props.changeView(nextProps.routerProps, this.props.routerProps);
      this.props.fetchPosts(nextProps.categoryPath);
    }
  }

  disableClick(e){
    e.preventDefault();
  }
  onChangeSort(e, sortBy){
    e.preventDefault();
    this.props.onChangeSort(sortBy);
  }

  render() {

    let isInValidUrl;
    if (!this.props || !this.props.validUrls || !this.props.loc ||
        this.props.validUrls.indexOf(this.props.loc.url) === -1){
      // console.log('Posts, isInValidUrl, url:', this.props && this.props.loc && this.props.loc.url)
      isInValidUrl = true;
    }
    else { isInValidUrl = false; }

    if (isInValidUrl){
      return (
        <FetchStatus routerProps={ this.props.routerProps }
          fetchStatus={this.props.fetchStatus}
          label={'posts'}
          item={this.props.posts}
          retryCallback={()=>this.props.fetchPosts(this.props.categoryPath)}
        />
      );
    }

    // valid categoryPath can have empty posts array: []
    const havePosts = (this.props && this.props.posts &&
                       Array.isArray(this.props.posts) && this.props.posts.length > 0)
                    ? true : false;

    let statusMessage = ''
    if (this.props.posts) {
      if (!Array.isArray(this.props.posts)) {
        console.log('Posts.render Error: Posts are not in an array format - they canot be mapped over !');
      }
      else {
        statusMessage = 'Be the first to write a post for category: '
                       + titleCase(this.props.categoryPath);
      }
    }

   const getPostUrl = (post) => {
      if (Object.keys(this.props.categoriesObject).length === 0){
        // categoriesObject is {}
        // categories must be read from file on server at app initial load (asynch)
        return '';  //  dummy link value until categoriesObject gets saved to store
      }
      const categoryName = post.category;  // categoryName === key for categoriesObject
      const categoryPath = this.props.categoriesObject[categoryName].path;
      const postParams = {
          categoryPath,
          postId: post.id,
      };
      const postLink = computeUrlFromParamsAndRouteName( postParams,'post' );
      return postLink;
    }

    return (
      <div>

          {/*New Post*/}
          <Link to={computeUrlFromParamsAndRouteName( {},'newPost' )}
                style={{"height":"100%",
                        "width" :"100%"
                      }}
                >
            <div><button><h2>Add New Post</h2></button></div>
          </Link>

          <hr />

          {/* sortBy  TODO refactor to map over SoryBy constants in viewData instead */}
          <div>
            <ul className="nav sort">
              <li className="no-link"> Sort By : </li>
              <li
                className={`${this.state.sortBy==='date' ? "selected" : ""}`}
                  onClick={this.state.sortBy==='date'
                            ? (()  => {this.disableClick})
                            : ((e) => {this.onChangeSort(e, 'date')})
                          }
                >
                Most Recent
              </li>
              <li
                className={(this.state.sortBy==='voteScore' ? "selected" : "")}
                  onClick={this.state.sortBy==='voteScore'
                          ? ()  => {this.disableClick}
                          : (e) => {this.onChangeSort(e, 'voteScore')}
                        }
              >
                Most Votes
              </li>
            </ul>
          </div>

          <hr />

          {/*posts*/}
          {( (!havePosts) &&
             (<div><p>{statusMessage}</p></div>)
           ) || (
             <div>
              <ol>
                { this.state.posts.map(post => {
                    // EVERY element AND div has a unique key,
                    //  TODO:, can I REMOVE some of these keys ??
                    const id=post.id;
                    return (
                      <li key={post.id}>
                        <div key={`key-post-wrapper-div-${id}`}>

                          <Link key={`key-linkto-post-${id}`}
                                 to={getPostUrl(post)}
                                 >
                            <h1 key={`key-${post.title}-${id}`}>
                                {post.title}
                                </h1>
                          </Link>

                          <div key={`key-voting-${id}`}
                               className="vote centered">
                            <p key={`key-post-up-vote-${id}`}
                               className="comment-up-vote centered"
                               onClick={() => {this.props.onUpVotePost(post.id)}}
                               >
                            </p>
                            <p key={`key-post-down-vote-${id}`}
                               className="comment-down-vote centered"
                               onClick={() => {this.props.onDownVotePost(post.id)}}
                               >
                            </p>
                          </div>

                          <div key={`key-edit-delete-div-${id}`}>
                            <Link key={`key-linkTo-deletePost-${id}`}
                                  to={`${ROUTES.category.base}${this.props.categoryPath}`}
                                  onClick={() => {this.props.onDeletePost(post.id)}}
                                  >
                              Delete Post
                            </Link>

                            <Link key={`key-linkTo-editPost-${id}`}
                                  to={`${ROUTES.editPost.base}${post.id}`}
                                  >
                              Edit Post
                            </Link>
                          </div>

                          <p key={`key-author-and-datePublished-${id}`}>
                            by: {post.author}, {dateMonthYear(post.timestamp)}
                          </p>

                          <div key={`key-votes-comments-counts-${id}`} className="counts">
                            {post.voteScore} Votes | {post.commentCount} Comments
                          </div>

                          <p key={`key-postCategory-${id}`}>
                            {titleCase(post.category)}
                          </p>

                          <div key={`key-empty-div-${id}`}></div>
                          <hr  key={`key-hr-after-post-${id}`}/>
                       </div>
                      </li>
                    )
                })}
              </ol>
            </div>
          )}

      </div>
    );
  }
}

function sortPosts(posts, sortMethod=DEFAULT_SORT_BY, orderBy=DEFAULT_SORT_ORDER) {
  if (!posts) return posts;  // an invalid categoryRoute sets posts to null
  const isHIGH_TO_LOW = (orderBy === DEFAULT_SORT_ORDER) ? 1 : -1;

  const sorted = posts.sort((postA, postB) => {
    if (sortMethod === 'date'){
      if (postA.timestamp === postB.timestamp) return 0;
      if (postA.timestamp  <  postB.timestamp) return 1 * isHIGH_TO_LOW
      else return -1 * isHIGH_TO_LOW
    }
    if (sortMethod === 'voteScore'){
      if (postA.voteScore === postB.voteScore) return 0;
      if (postA.voteScore  <  postB.voteScore) return 1 * isHIGH_TO_LOW
      else return -1 * isHIGH_TO_LOW
    }
    return 0;  // invalid sortMethod, do not change order of incoming elements
  });
  return sorted;
};


function mapDispatchToProps(dispatch){
  return ({
    fetchPosts: (category) => dispatch(fetchPosts(category)),

    onUpVotePost:   (postId) => dispatch(upVotePost(postId)),
    onDownVotePost: (postId) => dispatch(downVotePost(postId)),
    onDeletePost:     (postId) => dispatch(deletePost(postId)),

    changeView: (routerProps) => dispatch(changeView(routerProps)),
    onChangeSort: (sortBy) => dispatch(changeSort(sortBy)),
  })
}

function mapStoreToProps (store, ownProps) {

  //  Fewer re-renders by setting loc from routerProps,,
  //  rather than pulling from store (store.viewData.loc)
  const loc = getLoc(ownProps.routerProps) || null;
  const categoryPath = loc.categoryPath    || null

  const validCategoryUrls = getValidCategoryUrls(store);
  const fetchStatus = getFetchStatus(store);

  //  early exit to render a 404
  if (!loc || (validCategoryUrls.indexOf(loc.url) === -1)) {
    // Exit - before calling selectors / constants constants !
    //    Set as many values to NULL or CONSTANTS as possible..
    //    whilst not breaking the component before it renders the 404 error message
    return ({
          posts:     null,
          sortBy:    DEFAULT_SORT_BY,
          sortOrder: DEFAULT_SORT_ORDER,
          validUrls: null,  // validCategoryUrls,
          loc,
          categoryPath,     // null if not on a validCategoryPath
          fetchStatus,
        })
  }

  const posts = getPostsCurrentCategory(store, ownProps);

  return {
    categoriesObject: getCategoriesObject(store),

    posts,
    sortBy:    store.viewData.persistentSortBy,
    sortOrder: store.viewData.persistentSortOrder,

    validUrls: validCategoryUrls,
    loc,
    categoryPath,
    fetchStatus,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Posts)
