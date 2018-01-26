import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../state/posts/ducks';
import PostHeader from './PostHeader';
import { changeView } from '../state/viewData/ducks';

export class Posts extends Component {

  componentDidMount() {
    if(!this.props.posts || this.props.posts.length < 1) {
      this.props.getPosts();
    }
    else {console.log('Posts componentDidMount ..not refetching, posts:', this.props.posts);}
    // may need to move this to App.js

    // console.log('Posts cDM, leaving:', `${this.state||this.props||'no state or props'}`);
  }

  render() {

    const propsValue = this.props||this.state||'no props or state'
    // console.log('in Posts render, Props:', propsValue);

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
            <ol>
              {this.props.posts.map(post => {
                return (
                  <li key={post.id}>
                    {/*<PostHeader post={post} />*/}
                    {/*<PostHeader onclick= {() => {
                          this.props.showPost(`/post/${post.id}`, post.id)
                       }}/>
                     */}
                    {/*copy Postheader code into here*/}
                    <div>
                      <div key={post.id}>
                        {/*<Link to={location} >*/}
                        <Link to={`/post/${post.id}`} onClick={(e) => {
                          /*this.props.dispatch(changeView(`/post/${post.id}`, post.id))*/
                            this.props.onChangeView(`/post/${post.id}`, post.id)
                        }}>
                          <h2>{post.title}</h2>
                        </Link>

                        <div>votes: {post.voteScore} increment decrement</div>
                        <p>{post.category}</p>
                        <div>number of comments: {post.commentCount}</div>
                        <hr />
                      </div>
                    </div>
                    {/*end copy Postheader code into here*/}

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
  // console.log("in Posts mapDispatchToProps");
  return ({
    getPosts: () => dispatch(fetchPosts()),
    onChangeView: (url, selected) => dispatch(changeView({ url, selected })),
  })
}

function mapStoreToProps ( state ) {
  // const posts = state.posts;
  // console.log("__in Posts mapStoreToProps, state:", state);
  // console.log('__mSTP: posts as enter mapStoreToProps:', state.posts);

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
