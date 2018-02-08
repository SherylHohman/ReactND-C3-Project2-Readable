import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../store/posts';
import Categories from './Categories';
import { changeView, HOME } from '../store/viewData';

export class Posts extends Component {

  componentDidMount() {
    this.props.fetchPosts(this.props.selectedCategoryName);
    // console.log('Posts componentDidMount ..fetching, posts for category:', this.props.selectedCategoryName);
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
        statusMessage = 'No Posts Available';
          if (!Array.isArray(this.props.posts)) {
            statusMessage = 'Posts are contained in an object. I need them transformed into an array, so I can map over them!';
          }
      }
    }

    if (!havePosts){
      return (<div><p>{statusMessage}</p></div>);
    }

    return (
      <div>
          <div> {/*sort by*/}
          <ul className="nav"><li>Sort Posts By:</li> <li>Most Recent</li><li>Highest Votes</li></ul>
          </div>

          {/*Categories*/}
          <Categories />
          <hr />

          {/*New Post*/}
          <Link to={`/post/new`} onClick={() => {
            this.props.onChangeView(`/new`, 'newPostIdPlaceholder')
          }}>
            <div><h2>Add New Post</h2><hr /></div>
          </Link>

          <div> {/*posts*/}
            <ol>
              {this.props.posts.map(post => {
                return (
                  <li key={post.id}>
                    <div>

                      <Link to={`/post/${post.id}`} onClick={() => {
                        this.props.onChangeView(`/post/${post.id}`, post.id)
                      }}>
                        <h1>{post.title}</h1>
                      </Link>

                      <div>{post.voteScore} Votes | {post.commentCount} Comments</div>
                      <p>{post.category}</p>
                      {/* TODO move Link closing tag to here - after update styles*/}
                      <div></div>
                      <hr />
                   </div>
                  </li>
                )
              })}
            </ol>
          </div>

      </div>
    );
  }
}

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
  })
}

function mapStoreToProps ( store ) {
  console.log('store:', store);

  // object to array
  const posts = Object.keys(store.posts).reduce((acc, postId) => {
      return acc.concat([store.posts[postId]]);
    }, []);
  console.log('posts:', posts)

  const selectedCategoryName = (store && store.viewData
    && store.viewData.persistentCategory)
     ? store.viewData.persistentCategory.name
     : HOME.category.name;
  // console.log('selectedCategoryName:', selectedCategoryName)

  return {
    posts,
    selectedCategoryName,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Posts)
