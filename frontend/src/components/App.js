import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Link, Switch } from 'react-router-dom';
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
          <div className="app-intro">
            <small>..an app for posting and viewing posts and comments</small>
          </div>
          {/*<input placeholder="Sign In to: Vote, Comment, Create/Edit Posts" />*/}
        </header>


      {/* Routes */}
        <Route exact path="/" render={({ history }) => (
          <Posts />
        )} />

        <Route path="/category" render={({ history }) => (
          <Posts />
        )} />

        <Switch>
          <Route exact path="/post/new" render={({ history }) => (
            <NewPost />
          )} />

          <Route path="/post/:postId/edit" render={({ history }) => (
            <EditPost history={history}/>
          )} />

          <Route exact path="/post/:postId" render={({ history }) => (
            <Post />
          )} />
        </Switch>

        <hr />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return ({
    onChangeView: (url, selected) => dispatch(changeView({ url, selected })),
  })
}

function mapStoreToProps ( store ) {
  return {

  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(App);
