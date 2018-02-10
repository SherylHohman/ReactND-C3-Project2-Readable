import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Link, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Posts from './Posts';
import Post from './Post';
import NewPost from './NewPost';
import EditPost from './EditPost';
// import { fetchCategories } from '../store/categories';
import { changeView, HOME } from '../store/viewData';
// import { pullFromStore } from '../utils/helpers';

class App extends Component {

  componentDidMount() {
    console.log("in App componentDidMount");
    // this.props.fetchCategories();
  }

  render() {

    return (
      <div className="app-container">

        <header className="app-header">

          <Link to="/" onClick={() => {
            this.props.onChangeView(HOME.url)
          }}>
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

        <Route path="/category/:category" render={({ history }) => (
          <Posts history={history} />
        )} />

        <Switch>
          <Route exact path="/post/new" render={({ history }) => (
            <NewPost history={history} />
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
    // fetchCategories: () => dispatch(fetchCategories()),
  })
}

function mapStoreToProps ( store ) {
  // const categoriesArray = Object.keys(store.categories).reduce((acc, categoryKey) => {
  //   return acc.concat([store.categories[categoryKey]]);
  // }, []);

  // console.log('viewData:', store.viewData);
  return {
      // categories: pullFromStore.categories(store) || null,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(App);
