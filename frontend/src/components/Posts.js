import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../store/posts';
import Categories from './Categories';
import { changeView, getUri, changeSort, DEFAULT_SORT_BY, DEFAULT_SORT_ORDER} from '../store/viewData';

export class Posts extends Component {

  state = {
    posts: [],
    sortBy: DEFAULT_SORT_BY,
    sortOrder: DEFAULT_SORT_ORDER,
  }

  componentDidMount() {
    // this.props.fetchPosts(this.props.selectedCategoryName);
    this.props.fetchPosts(this.props.categoryPath);
    // console.log('Posts cDM ..fetching, posts for category:', this.props.categoryPath);
    if (this.props.uri){
      // console.log('Posts cDM calling changeView, this.props.uri', this.props.uri);
      this.props.changeViewByUri(this.props.uri)
    }
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

    if (this.props.uri && nextProps.uri && nextProps.uri.url !== this.props.uri.url){
      // console.log('__Posts cWRprops calling changeView, this.props.uri', this.props.uri);
      this.props.changeViewByUri(nextProps.uri)
    }
    else {  // for monitoring how app works
      // console.log('__Posts cWRprops NOT calling changeView, nextProps.uri', nextProps.uri.url, this.props.uri.url);
    }

    if (nextProps.categoryPath && this.props.categoryPath &&
        nextProps.categoryPath !== this.props.categoryPath){
          console.log('....____Posts cWRprops, fetching..new posts, categoryPath:', nextProps.categoryPath);
          this.props.fetchPosts(nextProps.categoryPath);
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
          <Categories routerProps={ this.props.routerProps }/>
          <hr />

          {/*New Post*/}
          <Link to={`/post/new`}>
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

                          <Link to={`/post/${post.id}`}>
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
  return sorted;
};


function mapDispatchToProps(dispatch){
  return ({
    fetchPosts: (category) => dispatch(fetchPosts(category)),
    changeViewByUri: (uri) => dispatch(changeView({ uri })),
    onChangeSort: (sortBy) => dispatch(changeSort(sortBy)),
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('store:', store);
  // console.log('Posts ownProps:', ownProps);

  // const history = (ownProps.routerProps && ownProps.routerProps.history )|| null

  // object to array
  const posts = Object.keys(store.posts).reduce((acc, postId) => {
      return acc.concat([store.posts[postId]]);
    }, []);
  const sortedPosts = sortPosts(posts, store.viewData.persistentSortBy);

  const uri = getUri(ownProps.routerProps) || null;

  return {
    posts: sortedPosts,
    sortBy:    store.viewData.persistentSortBy    || DEFAULT_SORT_BY,
    sortOrder: store.viewData.persistentSortOrder || DEFAULT_SORT_ORDER,

    uri,
    categoryPath: uri.currentId,  // === uri.currentCategoryPath  TEMP

  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Posts)
