import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../store/posts';
import Categories from './Categories';
import { changeView, HOME, changeSort, DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from '../store/viewData';

export class Posts extends Component {

  state = {
    posts: [],
    sortBy: DEFAULT_SORT_BY,
    sortOrder: DEFAULT_SORT_ORDER,
  }

  componentDidMount() {
    this.props.fetchPosts(this.props.selectedCategoryName);
    console.log('Posts componentDidMount ..fetching, posts for category:', this.props.selectedCategoryName);
  }
  componentWillReceiveProps(nextProps){
    // console.log('Posts cWRP nextProps:', nextProps);

    if (nextProps.sortBy) {
      this.setState({ sortBy: nextProps.sortBy });
    }
    if (nextProps.posts) {
      const sortedPosts = sortPosts(nextProps.posts,
                                    nextProps.sortBy || this.state.sortBy);
      this.setState({ posts: sortedPosts });
    }
  }

  onChangeSort(e, sortBy){
    e.preventDefault();
    this.props.onChangeSort(sortBy);
  }

  render() {

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
          <div> {/*sort by  TODO map over constants in viewData instead */}
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
              Highest Votes
            </li>
          </ul>
          </div>

          {/*Categories*/}
          <Categories history={this.props.history}/>
          <hr />

          {/*New Post*/}
          <Link to={`/post/new`} onClick={() => {
            this.props.onChangeView(`/new`, 'newPostIdPlaceholder')
          }}>
            <div><h2>Add New Post</h2><hr /></div>
          </Link>

          {/*posts*/}
          {( (!havePosts) &&
             (<div><p>{statusMessage}</p></div>)
           ) || (
             <div>
              <ol>
                { this.state.posts.map(post => {
                    return (
                      <li key={post.id}>
                        <div>

                          <Link to={`/post/${post.id}`} onClick={() => {
                            this.props.onChangeView(`/post/${post.id}`, post.id)
                          }}>
                            <h1>{post.title}</h1>
                          </Link>

                          <div className="counts">
                            {post.voteScore} Votes | {post.commentCount} Comments
                          </div>
                          <p>{post.category}</p>
                          <div></div>
                          <hr />
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
  // console.log('enter sortPosts, posts:', posts, 'sortMethod', sortMethod);
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
    return 0;  // no sort
  });
  // console.log('leaving sortBy, posts: ', posts);
  return sorted;
};


function mapDispatchToProps(dispatch){
  return ({
    fetchPosts: (category) => dispatch(fetchPosts(category)),
    onChangeView: (url, id) => dispatch(changeView({
      currentUrl:url,
      currentId: id
    })),
    onChangeViewByCategory: (category) => dispatch(changeView({
      persistentCategory:category
    })),
    onChangeSort: (sortBy) => dispatch(changeSort(sortBy)),
  })
}

function mapStoreToProps ( store ) {
  // console.log('store:', store);

  // object to array
  const posts = Object.keys(store.posts).reduce((acc, postId) => {
      return acc.concat([store.posts[postId]]);
    }, []);
  const sortedPosts = sortPosts(posts, store.viewData.persistentSortBy);
  // console.log('__mapStoreToProps, sortedPosts:', sortedPosts)

  const selectedCategoryName = (store && store.viewData
    && store.viewData.persistentCategory)
     ? store.viewData.persistentCategory.name
     : HOME.category.name;  // console.log('selectedCategoryName:', selectedCategoryName)

  return {
    posts: sortedPosts,
    selectedCategoryName,
    sortBy:    store.viewData.persistentSortBy    || DEFAULT_SORT_BY,
    sortOrder: store.viewData.persistentSortOrder || DEFAULT_SORT_ORDER,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Posts)
