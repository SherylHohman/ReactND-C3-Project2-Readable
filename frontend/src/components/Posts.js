import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPosts } from '../utils/api';

export class Posts extends Component {

  componentWillMount() {
    console.log("in Posts componentWillMount");

    fetchPosts().then((postObjects) => {
      console.log('posts fetched:', postObjects);

      const posts = postObjects
        .reduce((acc, postObject) => {
          return acc.concat(postObject);
        }, []);
      console.log('posts as array;', posts);

      this.setState({ posts });
    });
  }

  state: {
    posts: "fetching posts.."
  }

  render() {
    console.log('rendering..');
    if ((this.state) && (this.state.posts)) {
      console.log('this.state.posts', this.state.posts);
    }
    else{
      console.log('no state! - use setStoreToProps, or setState');
    }

    return (
      <div>
          {this.state && this.state.posts &&
              (
                <ul>
                  {this.state.posts.map(post => {
                    return (
                      <li key={post.id}>title:{post.title}</li>
                    )
                  })}
                </ul>
              )
          }
          { (!this.state || !this.state.posts) &&
            <p>No Categories Available</p>
          }
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return ({

  })
}

function mapStoreToProps ( { posts }) {
  return {

  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Posts);

