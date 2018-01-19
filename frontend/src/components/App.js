import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCategories, fetchPosts } from '../utils/api';

class App extends Component {

  componentWillMount() {
    console.log("in componentWillMount");

    fetchCategories().then((categoryObjects) => {

      const categories = categoryObjects
        .reduce((acc, categoryObject) => {
          return acc.concat(categoryObject.name);
        }, []);
      console.log('categories as array;', categories);

      this.setState({ categories });
    });

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
    categories: "fetching categories..",
    posts: "fetching posts.."
  }

  render() {
    console.log('rendering..');
    if ((this.state) && (this.state.categories)) {
      console.log('this.state.categories', this.state.categories);
    }
    else{
      console.log('no state! - use setStoreToProps, or setState');
    }
    if ((this.state) && (this.state.posts)) {
      console.log('this.state.posts', this.state.posts);
    }
    else{
      console.log('no state! - use setStoreToProps, or setState');
    }

    return (
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Readable</h1>
          {/*temp categories render*/}
          {this.state && this.state.categories &&
              (
                <ul>
                  {this.state.categories.map(category => {
                    return (
                      <li key={category}>{category}</li>
                    )
                  })}
                </ul>
              )
          }
          { (!this.state || !this.state.categories) &&
              <p>No Categories Available</p>
          }
        </header>

        <div className="app-intro">
          ..an app for posting and viewing posts and comments
          <hr />
          {/*temp categories render*/}
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
          <hr />
        </div>

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

export default connect(mapStoreToProps, mapDispatchToProps)(App);

