import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Link, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Posts from './Posts';
import Post from './Post';
import NewPost from './NewPost';
import EditPost from './EditPost';
import { fetchPosts } from '../store/posts';
import { fetchCategories } from '../store/categories';
import { changeView, HOME } from '../store/viewData';

class App extends Component {

  componentDidMount() {
    console.log("in App componentDidMount");
    this.props.fetchCategories();
    this.props.fetchPosts();

    if (this.props.uri){
      this.updateLocation(this.props.uri)
    }
  }

  componentWillReceiveProps(nextProps){
    console.log('App, nextProps:', nextProps)
    // if (nextProps.routerInfo && (nextProps.routerInfo.url!==null) &&
    //     this.props.uri && nextProps.uri !== this.props.uri
    //    ){
    //     this.updateLocation(nextProps.uri)
    // }
    if ( nextProps.history && nextProps.history.match &&
       (nextProps.history.match.url !== this.props.viewDataUrl)
       ){
         this.updateLocation(nextProps.history.match.url);
    }
    // TODO: consider..
    // what about if nextProps-match-url and nextProps.viewData both are changing?
    // or if viewData changed beore match (is that even possible ?)
  }

  // THIS VERSION MAY WORK IN POSTS, etc, But NOT in APP
  // IN APP, the param is {filter: post}, and path is path: /:filter? and url is /post
  //
  // updateLocation(uri) {
  //   console.log('have new uri, will I call changeView ?');
  //   if (uri.route === "/category/:category") {
  //     this.onChangeViewByCategory(uri.params.categoryName)
  //   } // else
  //   if ((uri.route === "/post/:postId") ||
  //       (uri.route === "/post/:postId/edit")) {
  //     this.onChangeView(uri.pathname, this.props.params.postId)
  //   }
  // }

  // IN APP, the params:{filter: post}, and path: /:filter? and url: /post
  // This differs significantly to what the "Route"s or other Components see/get
  updateLocation(matchAppUrl) {
    console.log('have new uri, will I call changeView ?');
    if (matchAppUrl === "/") {
      this.onChangeViewByCategory(HOME.category)
    } // else

    // I do NOT have access to categoryName inside App, would inside Post/Category though
    // .. cannot PROPERLY set viewData without the Post/Category ID
    if (matchAppUrl === "/category") {
      this.onChangeView(matchAppUrl, null)
    } // else
    if (matchAppUrl === "/post"){
      this.onChangeView(matchAppUrl, null)
    }
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
          <Posts history={history} />
        )} />

        <Route path="/category/:categoryName" render={({ history }) => (
          <Posts history={history} />
        )} />

        <Switch>
          <Route exact path="/post/new" render={({ history }) => (
            <NewPost history={history} />
          )} />

          <Route path="/post/:postId/edit" render={({ history }) => (
            <EditPost history={history}/>
          )} />

          <Route exact path="/post/:postId" render={(props) => (
            <Post routerInfo={ props } />
          )} />
        </Switch>

        <hr />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  // for loading fron a saved URL
  return ({
    fetchPosts: () => dispatch(fetchPosts()),
    fetchCategories: () => dispatch(fetchCategories()),
    onChangeView: (url, id) => dispatch(changeView({
      currentUrl:url,
      currentId: id
    })),
    onChangeViewByCategory: (category) => dispatch(changeView({
      persistentCategory:category
    })),
  })
}

function mapStoreToProps (store, ownProps) {
  console.log('App store:', store);
  console.log('App ownProps:', ownProps);

  // object to array
  const postsArray = Object.keys(store.posts).reduce((acc, postId) => {
      return acc.concat([store.posts[postId]]);
    }, []);
  const categoriesArray = Object.keys(store.categories).reduce((acc, categoryKey) => {
    return acc.concat([store.categories[categoryKey]]);
  }, []);

  // format is different for APP than Post/Category
  // IN APP, eg.{ params: {filter: 'post'}, path: '/:filter?' url:'/post' }
  const history = (ownProps && ownProps.history) || null;
  const urlBase = (history.match && history.match.url) || null;
  console.log('App, urlBase:', urlBase);

  return {
    posts: postsArray,
    categories: categoriesArray,
    urlBase,
    viewDataUrl: store.viewData.currentUrl || null,
    viewDataId:  store.viewData.currentId  || null,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(App);
