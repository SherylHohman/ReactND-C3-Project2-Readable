import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Posts from './Posts';
import Post from './Post';
import NewPost from './NewPost';
import EditPost from './EditPost';
import { changeView } from '../state/viewData/ducks';

class App extends Component {

  componentDidMount() {
    console.log("in App componentDidMount");
  }

  render() {

    return (
      <div className="app-container">

        <header className="app-header">

          <Link to="/" onClick={() => {
            this.props.onChangeView('/', '')}}>
            <h1 className="app-title">Readable</h1>
          </Link>
          <hr />
          <div className="app-intro">
            <small>..an app for posting and viewing posts and comments</small>
          </div>
          <input placeholder="Sign In to: Vote, Comment, Create/Edit Posts" />
        </header>


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

        <Route path="post/edit" render={({ history }) => (
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

function mapDispatchToProps(dispatch){
  // console.log("in App mapDispatchToProps");
  return ({
    onChangeView: (url, selected) => dispatch(changeView({ url, selected })),
  })
}

function mapStoreToProps ( store ) {
  return {

  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(App);
// export default connect(null, mapDispatchToProps)(App);

 // export default App;
