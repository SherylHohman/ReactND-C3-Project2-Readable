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
import { changeView, HOME, getUri } from '../store/viewData';

class App extends Component {

  componentDidMount() {
    console.log("__in App componentDidMount, props:", this.props);

    this.props.fetchCategories();
    // this.props.fetchPosts();
    // this.props.fetchPosts(this.props.categoryPath);

    // if (this.props.uri){
    //   this.updateLocation(this.props.uri)
    // }

    // MAYBE: DO NOT SET VIEWDATA/URI in  APP AT ALL
    // if (this.props.uri){
    //   this.props.changeView(this.props.uri)
    // }
  }

  componentWillReceiveProps(nextProps){
    // console.log('__App, nextProps:', nextProps);
    // console.log('__App, this.props:', this.props);

    // if (nextProps) console.log('__App, nextProps.uri:', nextProps.uri);
    // if (this.props) console.log('__App, this.props.uri:', this.props.uri);

    // if (nextProps.routerInfo && (nextProps.routerInfo.url!==null) &&
    //     this.props.uri && nextProps.uri !== this.props.uri
    //    ){
    //     this.updateLocation(nextProps.uri)
    // }

    // if ( nextProps.history && nextProps.history.match &&
    //    (nextProps.history.match.url !== this.props.viewDataUrl)
    //    ){
    //      this.updateLocation(nextProps.history.match.url);
    // }

    // MAYBE: DO NOT SET VIEWDATA/URI in  APP AT ALL
    // if ( nextProps.uri && this.props.uri &&
    //    // (nextProps.uri.url !== this.props.uri.url)
    //    (nextProps.uri.url !== this.props.uri.url)
    //    ){
    //       console.log('different urls, nextProps.uri.url', nextProps.uri.url, this.props.uri.url)
    //      this.props.changeView(nextProps.uri);
    // }

    // TODO: consider..
    // what about if nextProps-match-url and nextProps.viewData both are changing?
    // or if viewData changed beore match (is that even possible ?)
  }

  // // IN APP, the params:{filter: post}, and path: /:filter? and url: /post
  // // This differs significantly to what the "Route"s or other Components see/get
  // updateLocation(matchAppUrl) {
  //   console.log('have new uri, will I call changeView ?');

  //   if (matchAppUrl === "/") {
  //     this.onChangeViewByCategory(HOME.category)
  //   } // else

  //   // I do NOT have access to categoryName inside App, would inside Post/Category though
  //   // .. cannot PROPERLY set viewData without the Post/Category ID
  //   if (matchAppUrl === "/category") {
  //     this.onChangeView(matchAppUrl, null)
  //   } // else
  //   if (matchAppUrl === "/post"){
  //     this.onChangeView(matchAppUrl, null)
  //   }
  // }

  render() {

    return (
      <div className="app-container">

        <header className="app-header">

          <Link to="/"
          /*onClick={() => {this.props.onChangeView(HOME.url)}}*/
          >
            <h1 className="app-title">Readable</h1>
          </Link>
          <div className="app-intro">
            <small>..an app for posting and viewing posts and comments</small>
          </div>
          {/*<input placeholder="Sign In to: Vote, Comment, Create/Edit Posts" />*/}
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
}

function mapDispatchToProps(dispatch){
  // for loading fron a saved URL
  return ({
    fetchPosts: () => dispatch(fetchPosts()),
    fetchCategories: () => dispatch(fetchCategories()),
    // onChangeView: (url, id) => dispatch(changeView({
    //   currentUrl:url,
    //   currentId: id
    // })),
    // onChangeViewByCategory: (category) => dispatch(changeView({
    //   persistentCategory:category
    // })),
    changeView: (uri) => dispatch(changeView({ uri })),
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('App store:', store);
  // console.log('App ownProps:', ownProps);

  // object to array
  const postsArray = Object.keys(store.posts).reduce((acc, postId) => {
      return acc.concat([store.posts[postId]]);
    }, []);
  const categoriesArray = Object.keys(store.categories).reduce((acc, categoryKey) => {
    return acc.concat([store.categories[categoryKey]]);
  }, []);


 // MAYBE: DO NOT SET VIEWDATA/URI in  APP AT ALL
  // // format is different for APP than Post/Category
  // // IN APP, eg.{ params: {filter: 'post'}, path: '/:filter?' url:'/post' }
  // const history = (ownProps && ownProps.history) || null;
  // const urlBase = (history.match && history.match.url) || null;
  // // console.log('App, urlBase:', urlBase);

  // // unlike the other components, "router info" is passed in under "ownProps"
  // //   not as "ownProps.routerInfo", so create routerInfo here..
  // const routerInfo = {
  //   match:    ownProps.match,
  //   location: ownProps.location,
  //   history:  ownProps.history,
  // };
  // const uri = getUri(routerInfo) || null;
  // // // const uri = store.uri;
  // const categoryPath = (uri && (uri.categoryPath || uri.params.categoryPath))
  //                   || HOME.category.path;

  return {
    posts: postsArray,
    categories: categoriesArray,
  //   // urlBase,
  //   // viewDataUrl: store.viewData.currentUrl || null,
  //   // viewDataId:  store.viewData.currentId  || null,

  //   // // MAYBE: DO NOT SET VIEWDATA/URI in  APP AT ALL
  //   // // NOTE match.path === uri.route home page is "/:filter?",
  //   // // NOT "/" as the reduucers may think..
  //   // uri,
  //   categoryPath,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(App);
