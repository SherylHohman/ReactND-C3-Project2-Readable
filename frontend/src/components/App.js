import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Categories from './Categories';
import Posts from './Posts';
import PostDetail from './PostDetail';
import NewPost from './NewPost';
import EditPost from './EditPost';

class App extends Component {

  componentWillMount() {
    console.log("in App componentWillMount");
  }

  state: {
    username: '',   // controlled input
  }

  render() {

    return (
      <div className="app-container">

        <input placeholder="Sign In to: Vote, Comment, Create/Edit Posts" />

        <header className="app-header">
          <h1 className="app-title">Readable</h1>
          <Categories />
        </header>

        <div className="app-intro">
          ..an app for posting and viewing posts and comments
          <hr />
        </div>

        <Route exact path="/" render={({ history }) => (
          <Posts />
        )}/>

        <Route path="/category" render={({ history }) => (
          <Posts />
        )}/>

        <Route path="/post" render={(props) => (
          <PostDetail {...props}/>
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
