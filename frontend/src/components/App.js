import React, { Component } from 'react';
import { connect } from 'react-redux';
import Categories from './Categories';
import Posts from './Posts';

class App extends Component {

  componentWillMount() {
    console.log("in App componentWillMount");
  }

  state: {
    // categories: "fetching categories..",
    // posts: "fetching posts.."
  }

  render() {

    return (
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Readable</h1>
          <Categories />
        </header>
        <div className="app-intro">
          ..an app for posting and viewing posts and comments
          <hr />
          <Posts />
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

