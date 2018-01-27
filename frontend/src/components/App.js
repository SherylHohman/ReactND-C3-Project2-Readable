import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Posts from './Posts';
import Post from './Post';
import NewPost from './NewPost';
import EditPost from './EditPost';

class App extends Component {

  componentDidMount() {
    console.log("in App componentDidMount");
  }

  render() {

    return (
      <div className="app-container">

        <input placeholder="Sign In to: Vote, Comment, Create/Edit Posts" />

        <header className="app-header">
          <h1 className="app-title">Readable</h1>
        </header>

        <div className="app-intro">
          ..an app for posting and viewing posts and comments
          <hr />
        </div>

      {/* Routes */}
        <Route exact path="/" render={({ history }) => (
          <Posts />
        )}/>

        <Route path="/category" render={({ history }) => (
          <Posts />
        )}/>

        <Route path="/post" render={({ history }) => (
          <Post/>
        )}/>

        <Route path="/edit" render={({ history }) => (
          <EditPost />
        )}/>

        <Route path="/new" render={({ history }) => (
          <NewPost />
        )}/>

        <hr />
      </div>
    );
  }
}

// function mapDispatchToProps(dispatch){
//   return ({

//   })
// }

// function mapStoreToProps ( store ) {
//   return {

//   }
// };

// export default connect(mapStoreToProps, mapDispatchToProps)(App);

 export default App;
