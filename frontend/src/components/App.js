import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCategories, fetchPosts } from '../utils/api';

class App extends Component {

  componentWillMount() {
    console.log("in componentWillMount");
    fetchCategories().then((data) => {
      console.log('got lost in finding my way back');
      console.log('data', data);
      // this.setState({ 'categories': ['a', 'b', 'c'] });
    fetchPosts();
    });
  }

  state: {
    categories: "nothing here !",
  }

  render() {
    console.log('rendering..');
    if ((this.state) && (this.state.categories)) {
      console.log('this.state.categories', this.state.categories);
    }
    else{
      console.log('no state!');
    }

    return (
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Readable</h1>
        </header>
        <p className="app-intro">
          ..an app for posting and viewing posts and comments
        </p>
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

