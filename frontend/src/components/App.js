import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Link, Switch } from 'react-router-dom';
import Categories from './Categories';
import Posts from './Posts';
import Post from './Post';
import NewPost from './NewPost';
import EditPost from './EditPost';
import PageNotFound from './PageNotFound';
import { fetchCategories } from '../store/categories';

class App extends Component{

  componentDidMount() {
    // console.log('Categories componentDidMount ..fetching, categories');
    // Almost every page needs categories, so it's easier to fetch them at App load,
    //   than for every component to see if they exist OR fetch
    //   This is necessary, because page may be loaded form a (saved URL).
    //   Also, store.categories Never changes throughout the life of the App.
    this.props.fetchCategories();
  }

  render() {
    // console.log('____App render, this.props', this.props);

    // same info as routerProps, but derived differently, hence using a diff name
    const appRouterProps = {
      history:  this.props.history,
      location: this.props.location,
      match:    this.props.match,
    }

    return (
      <div className="app-container">

        <header className="app-header">

          <Link to="/">
            <h1 className="app-title">Readable</h1>
          </Link>
          <div className="app-intro">
            <small> - an app to share your posts and comments - </small>
          </div>

        {/*Categories*/}
        <Categories routerProps={ appRouterProps }/>

        </header>

        <Route exact path="/" render={(routerProps) => (
          <Posts     routerProps={ routerProps } />
        )} />

      {/* Routes */}
        <Switch>
          <Route exact path="/post/new" render={(routerProps) => (
            <NewPost  routerProps={ routerProps } />
          )} />

          <Route path="/post/edit/:postId" render={(routerProps) => (
            <EditPost routerProps={ routerProps }/>
          )} />

          <Route exact path="/category/:postId" render={(routerProps) => (
            <Post     routerProps={ routerProps } />
          )} />

          <Route exact path="/:categoryPath" render={(routerProps) => (
            <Posts     routerProps={ routerProps } />
          )} />
        </Switch>

        <hr />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return ({
    fetchCategories: () => dispatch(fetchCategories()),
  })
}

export default connect(null, mapDispatchToProps)(App);
