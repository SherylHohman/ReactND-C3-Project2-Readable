import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Link, Switch } from 'react-router-dom';
import Posts from './Posts';
import Post from './Post';
import NewPost from './NewPost';
import EditPost from './EditPost';

function App(){

    return (
      <div className="app-container">

        <header className="app-header">

          <Link to="/">
            <h1 className="app-title">Readable</h1>
          </Link>
          <div className="app-intro">
            <small>..an app for posting and viewing posts and comments</small>
          </div>

        </header>


      {/* Routes */}
        <Route exact path="/" render={(routerProps) => (
          <Posts     routerInfo={ routerProps } />
        )} />

        <Route path="/category/:categoryPath" render={(routerProps) => (
          <Posts     routerInfo={ routerProps } />
        )} />

        <Switch>
          <Route exact path="/post/new" render={(routerProps) => (
            <NewPost  routerInfo={ routerProps } />
          )} />

          <Route path="/post/:postId/edit" render={(routerProps) => (
            <EditPost routerInfo={ routerProps }/>
          )} />

          <Route exact path="/post/:postId" render={(routerProps) => (
            <Post     routerInfo={ routerProps } />
          )} />
        </Switch>

        <hr />
      </div>
    );
}

export default App
