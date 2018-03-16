import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../store/posts';
import { ROUTES, HOME } from '../store/viewData';
import PageNotFound from './PageNotFound';
import { changeView, getLoc, changeSort, DEFAULT_SORT_BY, DEFAULT_SORT_ORDER} from '../store/viewData';
import { upVotePost, downVotePost, deletePost } from '../store/posts';
import { dateMonthYear, titleCase } from '../utils/helpers';
import { createSelector } from 'reselect';

export class Posts extends Component {

  state = {
    posts: [],
    sortBy: DEFAULT_SORT_BY,
    sortOrder: DEFAULT_SORT_ORDER,
  }

  isInValidUrl(){
    if (!this.props || !this.props.validUrls || !this.props.loc ||
        this.props.validUrls.indexOf(this.props.loc.url) === -1){
      // console.log('Posts, isInValidUrl, url:', this.props && this.props.loc && this.props.loc.url)
      return true;
    }
    return false;
  }

  componentDidMount() {
    // console.log('Posts componentDidMount');

    this.setState({ sortBy: this.props.sortBy });
    this.props.fetchPosts(this.props.categoryPath);
    // console.log('Posts cDM ..fetching, posts for category:', this.props.categoryPath);
    if (this.props.routerProps){
      // console.log('Posts cDM calling changeView, this.props.loc', this.props.loc);
      this.props.changeView(this.props.routerProps);
    }
  }

  componentWillReceiveProps(nextProps){
    // console.log('Posts.cWRP nextProps: ', nextProps);
    // console.log('Posts.cWRP this.Props:', this.props);

    if (nextProps.sortBy !== this.props.sortBy) {
      this.setState({ sortBy: nextProps.sortBy });
    }
    if (nextProps.posts !== this.props.posts) {
      // console.log('Posts cWRP, got new posts');
      // console.log('newPosts:', nextProps.posts, 'oldPosts:', this.props.posts);
      const sortedPosts = sortPosts(nextProps.posts,
                                    nextProps.sortBy || this.state.sortBy);
      this.setState({ posts: sortedPosts });
    }

    // if (nextProps.loc && this.props.loc &&
    //     nextProps.loc.url !== this.props.loc.url){
    //   console.log('__Posts cWRP,     calling changeView, nextProps.loc:', nextProps.loc);
    if ((nextProps.routerProps  && this.props.routerProps) &&
        (nextProps.routerProps !== this.props.routerProps)){
      // console.log('__Posts.cWRP,     calling changeView, nextProps.routerProps', nextProps.routerProps);
      this.props.changeView(nextProps.routerProps, this.props.routerProps);
      this.props.fetchPosts(nextProps.categoryPath);
    }
    else {  // for monitoring how app works
      // console.log('Posts.cWRP, NOT calling changeView, nextProps.loc.url:',
      //             nextProps.loc.url, ', this.props.loc.url:', this.props.loc.url);
      // console.log('Posts cWRP, NOT calling changeView, nextProps.loc.url:',
      //             nextProps.loc.url, ', this.props.loc.url:', this.props.loc.url);
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
    // console.log('re-render Posts');

    if (this.isInValidUrl()){
      // console.log('PageNotFound from within Posts component, loc:', this.props.loc)
      return (
        <div>
          <PageNotFound routerProps={ this.props.routerProps } />
        </div>
      );
    }

    const havePosts = (this.props && this.props.posts &&
                       Array.isArray(this.props.posts) && this.props.posts.length > 0)
                    ? true : false;

    // set status message to display TODO: state.statusMessage
    let statusMessage = ''
    if (this.props) {
      statusMessage = 'No Posts Data';
      if (this.props.posts) {
        statusMessage = 'Be the first to write a post..';
          if (!Array.isArray(this.props.posts)) {
            statusMessage = 'Posts are not in an array - they canot be mapped over !';
          }
      }
    }

    const getPostUrl = (post) => {
      // technically post.category is a categoryName, not a categoryPath.
      // currently in my DB, a categoryPath === categoryName
      // so this shortcut wroks - BEWARE for BUGS if change defined categories,
      //   and this is not longer the case.
      // console.log('____Posts.render.getPostUrl',
      //             '\npost.id:', post.id,
      //             '\ntpost.category', post.category,
      //             );
      const categoryPath = post.category;
      const postLink = `${ROUTES.post.base}${categoryPath}/${post.id}`;
      // console.log('____Posts.render.getPostUrl, post url:', postLink);
      return postLink;
    }

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

          {/* sortBy  TODO map over constants in viewData instead */}
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
                    // EVERY element AND div has a unique key, yet the warning persists
                    // What am I missing here ?? What more can it want
                    //  And, can I REMOVE some of these keys ??
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
                                  onClick={() => {this.props.deletePost(post.id)}}
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
  if (!posts) return posts;  // invalid categoryRoute sets posts to null
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
    return 0;  // no change
  });
  return sorted;
};


function mapDispatchToProps(dispatch){
  return ({
    fetchPosts: (category) => dispatch(fetchPosts(category)),

    onUpVotePost:   (postId) => dispatch(upVotePost(postId)),
    onDownVotePost: (postId) => dispatch(downVotePost(postId)),
    deletePost: (postId) => dispatch(deletePost(postId)),

    // changeViewByLoc: (loc) => dispatch(changeView({ loc })),
    changeView: (routerProps) => dispatch(changeView(routerProps)),
    onChangeSort: (sortBy) => dispatch(changeSort(sortBy)),
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('store:', store);
  // console.log('Posts ownProps:', ownProps);

  // const loc = store.viewData.loc || null;
  const loc = getLoc(ownProps.routerProps) || null;
  // console.log('Posts.mSTP, loc :', loc);

  // const for the life of the app, as categories don't change
  // valid /:category routes - vs 404
  const getValidCategoryUrls = createSelector(
    store => store.categories,
    (categories) => {
      const categoryNames = Object.keys(store.categories);
      let validUrls = categoryNames.map((categoryName) => {
        return '/' + store.categories[categoryName].path;
      });
      // HOME.url must be LAST in array for indexOf searches to work as expected
      validUrls.push(HOME.url);
      return validUrls;
    }
  );
  const validCategoryUrls = getValidCategoryUrls(store)

  if (!loc || (validCategoryUrls.indexOf(loc.url) === -1)) {
    // TODO: exit ASAP - before compute below constants ! - just want to render 404 mssg
    //    keep computations minimal:
    //    set as many values to NULL or CONSTANTS as possible..
    //    while not breaking the component
    // console.log('__Posts, mSTPs, invalidCategoryUrl - EXITING mSTP early, loc.url:',
    //             loc.url, validCategoryUrls, validCategoryUrls.indexOf(loc.url));
    return ({
          posts:     null,
          sortBy:    DEFAULT_SORT_BY,
          sortOrder: DEFAULT_SORT_ORDER,
          validUrls: null,  //validCategoryUrls,
          loc,
          categoryPath: loc.currentId,
        })
  }

  // TODO: move these selectors to ?? reducers files ??
  const getAllPosts = createSelector(
    store => store.fetchedPosts,
    (fetchedPosts) => {
      if (!fetchedPosts.posts){ return []; }
      // object to array
      const postsObj = fetchedPosts.posts;
      const allPosts = Object.keys(postsObj).reduce((acc, postId) => {
        // console.log('Posts.mSTP.getAllPosts', postsObj, postId);
        return acc.concat([postsObj[postId]]);
      }, []);
      return allPosts;
    }
  );
  const allPosts = getAllPosts(store);

  // TODO: save categorized posts filtered by category
  // const getPostIdsByCategory = createSelector(
  // );
  // const postIdsByCategory = getPostIdsByCategory(store);
  // const postIdsCurrentCategory = postIdsByCategory[loc.currentId] || null;

  const getPostsCurrentCategory = createSelector(
    getAllPosts,
    store => store.viewData.loc,
    (allPosts, loc) => {
      // console.log('Posts.mSTP.getPostsCurrentCategory',
      //             '\nloc.categoryPath', loc.categoryPath,
      //            );
      if (loc.route === ROUTES.home.route){
        return allPosts;
      }
      const postsCurrentCategory = allPosts.filter( (post) => {
        // console.log('Posts.mSTP.getPostsCurrentCategory',
        //             'post.category:', post.category,
        //             'loc.categoryPath:', loc.categoryPath,
        //             );
        return post.category === loc.categoryPath;
      });
      return postsCurrentCategory;
    }
  );
  const postsCurrentCategory = getPostsCurrentCategory(store);
  // console.log('Posts.mSTP, posts:', postsCurrentCategory);

  // const sortedPosts = sortPosts(allPosts, loc.persistentSortBy);
  // const sortedPosts = sortPosts(postsCurrentCategory, loc.persistentSortBy);
  // console.log('__Posts, mSTPs, sortedPosts', sortedPosts)

  const fetchStatus = store.fetchedPosts.fetchStatus;

  return {
    posts:     postsCurrentCategory,
    sortBy:    store.viewData.persistentSortBy,
    sortOrder: store.viewData.persistentSortOrder,

    validUrls: validCategoryUrls,
    loc,
    categoryPath: loc.categoryPath || null,
    fetchStatus,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Posts)
