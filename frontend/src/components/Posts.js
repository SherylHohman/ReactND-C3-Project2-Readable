import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../store/posts';
import { ROUTES, HOME } from '../store/viewData';
import PageNotFound from './PageNotFound';
import { changeView, getUri, changeSort, DEFAULT_SORT_BY, DEFAULT_SORT_ORDER} from '../store/viewData';
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
    if (!this.props || !this.props.validUrls || !this.props.uri ||
        this.props.validUrls.indexOf(this.props.uri.url) === -1){
      // console.log('Posts, isInValidUrl, url:', this.props && this.props.uri && this.props.uri.url)
      return true;
    }
    return false;
  }

  componentDidMount() {
    // console.log('Posts componentDidMount');
    this.props.fetchPosts(this.props.categoryPath);
    // console.log('Posts cDM ..fetching, posts for category:', this.props.categoryPath);
    if (this.props.uri){
      // console.log('Posts cDM calling changeView, this.props.uri', this.props.uri);
      this.props.changeViewByUri(this.props.uri)
    }
  }

  componentWillReceiveProps(nextProps){
    // console.log('Posts cWRP nextProps: ', nextProps);
    // console.log('Posts cWRP this.Props:', this.props);

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

    if (nextProps.uri && this.props.uri &&
        nextProps.uri.url !== this.props.uri.url){
      // console.log('__Posts cWRP,     calling changeView, nextProps.uri:', nextProps.uri);
      this.props.changeViewByUri(nextProps.uri)
      this.props.fetchPosts(nextProps.categoryPath);
    }
    else {  // for monitoring how app works
      // console.log('Posts cWRP, NOT calling changeView, nextProps.uri.url:',
      //             nextProps.uri.url, ', this.props.uri.url:', this.props.uri.url);
    }
  }

  onChangeSort(e, sortBy){
    e.preventDefault();
    this.props.onChangeSort(sortBy);
  }

  render() {
    // console.log('re-render Posts');

    if (this.isInValidUrl()){
      // console.log('PageNotFound from within Posts component, uri:', this.props.uri)
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

    return (
      <div>

          {/*New Post*/}
          <Link to={`${ROUTES.newPost.base}${ROUTES.newPost.param}`}
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
                onClick={(e) => {this.onChangeSort(e, 'date')}}
                >
                Most Recent
              </li>
              <li
                className={(this.state.sortBy==='voteScore' ? "selected" : "")}
                onClick={(e) => {this.onChangeSort(e, 'voteScore')}}
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
                                 to={`${ROUTES.post.base}${post.id}`}>
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

    changeViewByUri: (uri) => dispatch(changeView({ uri })),
    onChangeSort: (sortBy) => dispatch(changeSort(sortBy)),
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('store:', store);
  // console.log('Posts ownProps:', ownProps);

  const uri = getUri(ownProps.routerProps) || null;
  // console.log('Posts, uri:', uri);

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

  if (!uri || (validCategoryUrls.indexOf(uri.url) === -1)) {
    // TODO: exit ASAP - before compute below constants ! - just want to render 404 mssg
    //    keep computations minimal:
    //    set as many values to NULL or CONSTANTS as possible..
    //    while not breaking the component
    // console.log('__Posts, mSTPs, invalidCategoryUrl - EXITING mSTP early, uri.url:',
    //             uri.url, validCategoryUrls, validCategoryUrls.indexOf(uri.url));
    return ({
          posts:     null,
          sortBy:    DEFAULT_SORT_BY,
          sortOrder: DEFAULT_SORT_ORDER,
          validUrls: null,  //validCategoryUrls,
          uri,
          categoryPath: uri.currentId,
        })
  }

  // TODO: move these selectors to ?? reducers files ??
  const getAllPosts = createSelector(
    store => store.posts,
    store => store.viewData.persistentSortBy,
    (postsObj, persistentSortBy) => {
      // object to array
      const allPosts = Object.keys(postsObj).reduce((acc, postId) => {
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
  // const postIdsCurrentCategory = postIdsByCategory[uri.currentId] || null;

  const getPostsCurrentCategory = createSelector(
    store => store.viewData.currentId,
    store => store.viewData.url,
    store => store.persistentSortBy,
    (currentCategoryPath, url, persistentSortBy) => {
      // uses memoized selectors allPosts, and validCategoryUrls (defined above)
      const postsCurrentCategory = allPosts.filter( (post) => {
        return post.category === uri.currentId;
      });
      const currentPosts = (uri.currentId === HOME.category.path)
                   ? allPosts
                   : postsCurrentCategory
      return currentPosts;
    }
  );
  const postsCurrentCategory = getPostsCurrentCategory(store);

  // const sortedPosts = sortPosts(allPosts, uri.persistentSortBy);
  // const sortedPosts = sortPosts(postsCurrentCategory, uri.persistentSortBy);
  // console.log('__Posts, mSTPs, sortedPosts', sortedPosts)

  return {
    posts:     postsCurrentCategory, //sortedPosts,
    sortBy:    store.viewData.persistentSortBy    || DEFAULT_SORT_BY,
    sortOrder: store.viewData.persistentSortOrder || DEFAULT_SORT_ORDER,

    validUrls: validCategoryUrls,
    uri,
    categoryPath: uri.currentId,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Posts)
