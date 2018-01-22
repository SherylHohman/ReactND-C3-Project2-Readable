import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPosts } from '../state/posts/ducks';

export class Posts extends Component {

  componentWillMount() {
    this.props.getPosts();

    console.log('Posts cDM, leaving:', `${this.state||this.props||'no state or props'}`);
  }

  render() {

    const propsValue = this.props||this.state||'no props or state'
    console.log('Posts render:', propsValue);

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
          <hr />
          <div><h1>Add New Post</h1><hr /></div>
          <div> {/*post heading*/}
            {this.props.posts.map(post => {
              const {id, title, category, voteScore, commentCount} = post;
              const {author, timestamp, body} = post;
              const {deleted} = post;
              if (deleted) return;
              // TODO: better if remove before it gets to store

              return (
                <div key={id}>
                  <h2>{title}</h2>
                  <div>votes: {voteScore} increment decrement</div>
                  <p>{category}</p>
                  <div>number of comments: {commentCount}</div>
                  <hr />
                </div>
              )
            })}
          </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  console.log("in Posts mapDispatchToProps");
  return ({
    getPosts: () => dispatch(fetchPosts()),
  })
}

function mapStoreToProps ( state ) {
  // const posts = state.posts;
  // console.log("__in Posts mapStoreToProps, state:", state);
  // console.log('__mSTP: posts as enter mapStoreToProps:', state.posts);

  return {
    posts: state.posts.posts,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Posts)


/* TODO: ?
  - Perhaps setCurrentPost might be selectedPost ??
  To avoid falling into the "getters" setters" way of thinking,
  Do the ame paradigm for comments, categories, (user), etc.
*/
