import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../state/posts/ducks';
import Categories from './Categories';
import { changeView } from '../state/viewData/ducks';

export class Posts extends Component {

  componentDidMount() {
    this.props.getPosts();
    console.log('Posts componentDidMount ..fetching, posts');
  }

  render() {

    const havePosts = (this.props && this.props.posts && Array.isArray(this.props.posts)) ? true : false;

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

          <Categories />
          <hr />

          <Link to={`/post/new`} onClick={() => {
            this.props.onChangeView(`/new`, null)
          }}>
            <div><h2>Add New Post</h2><hr /></div>
          </Link>

          <div> {/*post heading*/}
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
    getPosts: () => dispatch(fetchPosts()),
    onChangeView: (url, selected) => dispatch(changeView({ url, selected })),
  })
}

function mapStoreToProps ( state ) {
  // turn object of post objects into array of post objects (for react mapping)
  const postIds = Object.keys(state.posts);
  const posts = postIds.reduce((acc, postId) => {
    return acc.concat([state.posts[postId]]);
  }, []);

  return {
    posts: posts,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Posts)
