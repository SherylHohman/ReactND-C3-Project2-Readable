import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Link, Switch } from 'react-router-dom';

//  Components
import Categories from './Categories';
import Posts from './Posts';
import Post from './Post';
import NewPost from './NewPost';
import EditPost from './EditPost';
import PageNotFound from './PageNotFound';

//  Action Creators
import { fetchCategories } from '../store/categories/actionCreators';

class App extends Component{

  componentDidMount() {
    // console.log('Categories componentDidMount ..fetching, categories');
    // Almost every page needs categories, so it's easier to fetch them at App load,
    //   than for every component to see if they exist, THEN fetch if they do not.
    //   This is necessary, because any page may be loaded from a (saved URL).
    //   Note: store.categories Never changes throughout the life of the App.
    this.props.fetchCategories();
  }

  render() {

    return (
      <BrowserRouter>
      <div className="app-container">

        <header className="app-header">

          <Link to="/">
            <h1 className="app-title">Readable</h1>
          </Link>
          <div className="app-intro">
            <small> - an app to share your posts and comments - </small>
          </div>

          {/*Categories*/}
          <Categories />

        </header>

      {/* Routes */}
        <Switch>
          <Route exact path="/" render={(routerProps) => (
            <Posts     routerProps={ routerProps } />
          )} />

          <Route exact path="/post/new" render={(routerProps) => (
            <NewPost  routerProps={ routerProps } />
          )} />

          <Route path="/post/edit/:postId" render={(routerProps) => (
            <EditPost routerProps={ routerProps }/>
          )} />

          <Route exact path="/:categoryPath/:postId" render={(routerProps) => (
            <Post     routerProps={ routerProps } />
          )} />

          <Route exact path="/:categoryPath" render={(routerProps) => (
            <Posts     routerProps={ routerProps } />
          )} />

          {/* Category Route (above) will also absorb Invalid URLs */}
          {/* so Posts also checks for invalid "category paths", and calls PageNotFound */}
          <Route render={(routerProps) => (
            <PageNotFound routerProps={ routerProps } />
          )} />
        </Switch>

        <hr />
      </div>
      </BrowserRouter>
    );
  }
}

function mapDispatchToProps(dispatch){
  return ({
    fetchCategories: () => dispatch(fetchCategories()),
  })
}

export default connect(null, mapDispatchToProps)(App);
