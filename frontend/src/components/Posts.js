import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// dispatch Action Creators
import { fetchPosts } from '../store/posts';
import { changeView, getLoc, changeSort } from '../store/viewData';
import { upVotePost, downVotePost, deletePost } from '../store/posts'; // post action creators

// Components
import FetchStatus from './FetchStatus';
import PageNotFound from './PageNotFound';

// Selectors
import { getPosts, getPostsCurrentCategory, getFetchStatus } from '../store/posts';  // post Selectors
import { getValidCategoryUrls } from '../store/categories';  // category selectors

// Actions and Constants, and helpers
import { ROUTES } from '../store/viewData';
import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER} from '../store/viewData';
import { dateMonthYear, titleCase } from '../utils/helpers';


export class Posts extends Component {

  state = {
    posts: [],
    sortBy: DEFAULT_SORT_BY,
    sortOrder: DEFAULT_SORT_ORDER,
  }

  componentDidMount() {
    // console.log('Posts componentDidMount');
    // console.log('Posts.cDM rPs  IS calling changeView, this.props.routerProps.location.pathname', this.props.routerProps.location.pathname);
    // console.log('Posts cDM ..fetching, posts for category:', this.props.categoryPath);

    // loc already reflects the value from routerProps as per mapStoreToProps
    this.props.changeView(this.props.routerProps);

    // categoryPath already reflects the value from routerProps as per mapStoreToProps
    this.props.fetchPosts(this.props.categoryPath);

    this.setState({ sortBy: this.props.sortBy });
  }

  componentWillReceiveProps(nextProps){
    // console.log('Posts.cWRP nextProps: ', nextProps);
    // console.log('Posts.cWRP this.Props:', this.props);

    if (nextProps.sortBy !== this.props.sortBy) {
      // console.log('Posts.cWRP nextProps: ', nextProps);
      const sortedPosts = sortPosts(nextProps.posts,
                                    nextProps.sortBy || this.state.sortBy);
      this.setState({
        posts:  sortedPosts,
        sortBy: nextProps.sortBy,
      });
    }

    if (nextProps.posts !== this.props.posts) {
      const sortedPosts = sortPosts(nextProps.posts,
                                    nextProps.sortBy || this.state.sortBy);
      this.setState({ posts: sortedPosts });
    }

    if ((nextProps.routerProps  && this.props.routerProps) &&
        (nextProps.routerProps !== this.props.routerProps)){
      // console.log('__Posts.cWRP rPs, calling changeView/fetch, nextProps.routerProps.location.pathname', nextProps.routerProps.location.pathname);
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
    // console.log('___Posts.render props:', this.props);
    // console.log('___Posts.render fetchStatus1:', this.props.fetchStatus);

    let isInValidUrl;
    if (!this.props || !this.props.validUrls || !this.props.loc ||
        this.props.validUrls.indexOf(this.props.loc.url) === -1){
      // console.log('Posts, isInValidUrl, url:', this.props && this.props.loc && this.props.loc.url)
      isInValidUrl = true;
    }
    else { isInValidUrl = false; }

    // console.log('Posts.render props:', this.props);
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

    // set status message to display TODO: state.statusMessage
    let statusMessage = ''
    // if (this.props) {
    //   taken care of by FetchStatus component
    //   statusMessage = 'I could not retrieve posts for category: ', this.props.categoryPath;
      if (this.props.posts) {
        statusMessage = 'Be the first to write a post for category: '
                         + titleCase(this.props.categoryPath);
          if (!Array.isArray(this.props.posts)) {
            statusMessage = 'Posts are not in an array format - they canot be mapped over !';
          }
      }
    // }

    // console.log('___Posts.render fetchStatus2:', this.props.fetchStatus);
    // if (!havePosts) {
    //   // loading "spinner", fetch failure, or 404
    //   return (
    //     <FetchStatus routerProps={ this.props.routerProps }
    //       fetchStatus={this.props.fetchStatus}
    //       label={'posts'}
    //       item={this.props.posts}
    //       retryCallback={()=>this.props.fetchPosts(this.props.categoryPath)}
    //     />
    //   );
    // }

    const getPostUrl = (post) => {
      // technically post.category is a categoryName, not a categoryPath.
      // currently in my DB, a categoryPath === categoryName
      // so this shortcut wroks - BEWARE for BUGS if change defined categories,
      //   and this is not longer the case.
      // console.log('____Posts.render.getPostUrl',
      //             '\npost.id:', post.id,
      //             '\ntpost.category', post.category,
      //             );
      // TODO: replace this function with a function from viewData,
      //       near ROUTES definitions. Keep route calcs near Routes Defs, as
      //       the calculation is dependant on ROUTE definitions.
      //       locally, I should no need to keep track of defs, or even know
      //       how to calculate them.  Just consume them after providing necessary params
      const categoryPath = post.category;
      const postLink = `${ROUTES.post.base}${categoryPath}/${post.id}`;
      // console.log('____Posts.render.getPostUrl, post url:', postLink);
      return postLink;
    }

    // console.log('Posts.render re-rendering');
    return (
      <div>

          {/*New Post*/}
          {/*<Link to={`${ROUTES.newPost.base}${ROUTES.newPost.param}`}*/}
          <Link to={ROUTES.newPost.route}
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
  // console.log('store:', store);
  // console.log('Posts ownProps:', ownProps);

  //  performance boost by setting loc via (getLoc(routerProps)),
  //    rather than pulling from store (store.viewData.loc)
  //    The latter requires an extra render - 1st using OLD url, 2nd using correct URL
  //    reason being is that cDM calls changeView, so render happens before
  //      changeView can update loc.
  // const loc = store.viewData.loc || null;
  const loc = getLoc(ownProps.routerProps) || null;
  const categoryPath = loc.categoryPath    || null

  const validCategoryUrls = getValidCategoryUrls(store);
  const fetchStatus = getFetchStatus(store);// ? getFetchStatus(store) : null;

  //  early exit to render a 404
  if (!loc || (validCategoryUrls.indexOf(loc.url) === -1)) {
    // TODO: exit ASAP - before compute below selectors and constants !
    //    - just want component to render a 404 mssg
    //    to computations minimal:
    //    I set as many values to NULL or CONSTANTS as possible..
    //    whilst not breaking the component before it renders the 404 error message
    return ({
          posts:     null,
          sortBy:    DEFAULT_SORT_BY,
          sortOrder: DEFAULT_SORT_ORDER,
          validUrls: null,  //validCategoryUrls,
          loc,
          categoryPath, //: loc.categoryPath,
          fetchStatus,
        })
  }

  const posts = getPostsCurrentCategory(store, ownProps);
  // console.log('___Posts.mSTP fetchStatus:', fetchStatus);

  return {
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
