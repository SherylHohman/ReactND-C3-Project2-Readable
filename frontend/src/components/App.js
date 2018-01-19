import React, { Component } from 'react';
import { connect } from 'react-redux';

class App extends Component {
  render() {
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

function mapStoreToProps ( { TODO }) {
  return {

  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(App);

