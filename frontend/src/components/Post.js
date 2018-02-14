 import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import { changeView, HOME } from '../store/viewData';
import { upVotePost, downVotePost, deletePost, fetchPost } from '../store/posts';
import { dateMonthYear } from '../utils/helpers';
import PropTypes from 'prop-types';

export class Post extends Component {

  componentDidMount() {
    // console.log('in Post componentDidMount');

    // re-direct to home page if don't have the post, and can't read from url)
    if (this.props.history && !this.props.postId){
      console.log(' don\'t have postId yet.. but let\'s wait for cWillRprops before redirecting')
      // this.props.history.push(HOME.url);
      // <Redirect to={HOME.ulr} />
    }

    // TODO if page is loaded from saved url,
    //  fetch the post, based on post.id that's in the url
    if (this.props.postId && !this.props.post){
      this.props.fetchPost(this.props.postId);

      // // App "assumes" its loaded using the root url, update viewData with actual url
      // // also set viewData to reflect page that actually on - maybe do this in App.js?
      // if (this.props && this.props.match & this.props.match.url) {
      //   this.changeView(this.props.match.url, this.props.match.params.postId)
      // }
    }

    if (this.props.uri){
      // console.log('have uri, will I call changeView ?');
      // if (this.props.uri.route === "/category/:category") {
      //   this.onChangeViewByCategory(this.props.uri.postId.categoryName)
      // } // else
      // if ((this.props.uri.route === "/post/:postId") ||
      //     (this.props.uri.route === "/post/:postId/edit")) {
      //   this.onChangeView(this.props.uri.pathname, this.props.uri.postId)
      // }
      this.props.updateLocation(this.props.uri)
    }
  }

  componentWillReceiveProps(nextProps){
    // console.log('__Post, nextProps:', nextProps);

    // if (nextProps.uri && (nextProps.uri.url) &&
    //     nextProps.uri !== this.props.uri   // shallow check
    //    ){
    //     this.updateLocation(nextProps.uri)
    // }
  }

  onDelete(postId){
    // must call deletePost before changeView
    this.props.deletePost(postId);
    // Link redirects to category that this post previously appeared
    // viewData musht store this same info to keep in synch
    // Not Dry :/ - TODO: read and parse data from URL routes
    const category = {
      name: this.props.post.category,
      path: this.props.categoryPath,
    }
    this.props.changeViewByCategory(category);
  }

  render(){

    // // for exploring history when must rely on url
    // if (props && props.location) {  // && props.location.state) {
    //   console.log('Post props.location');
    // }
    // if (props && props.match) {
    //   console.log('Post, url match', props.match);
    // }


    const props = this.props;
    if (!this.props){console.log('Post props is undefined');}

    // const post =
    //   (props && props.post) ||
    //   (props && props.location && props.location.state && props.location.state.post) ||
    //   (props && props.match && props.match.params && props.match.params.post) ||
    //   null;

    // If page is loaded from a saved url. Store is empty. Redirect
    // A better solution would be to read the post id from the url.. fetch data.

    /*
    if (post === null) {
      console.log('Post: post wasn\'t present in props, redirecting to home page.');
      return (
        <div>
          <p>post wasn't present in props:</p>
          <Redirect to="/" push />
        </div>
      )
    }
  */

    if (!this.props.post) {
      console.log('Post: post wasn\'t present in props, do I have the postID?:', this.props.postId);
      return (
        <div>
          <p>looking for your Post:</p>
        </div>
      )
    }

    const postId = this.props.postId;  // change to == post.id ?  //see above, and below.
    const {title, body, voteScore, commentCount, author, timestamp } = this.props.post;

    // disambiguate:
    // category is an {name, path} on categories,
    // category is a name on post
    const categoryName = this.props.post.category;

    return (
      <div>
        <div>
            <Link
              to={`/post/${postId}`}
              onClick={() => {this.props.onChangeView(`/post/${postId}`, postId)
            }}>
              <h2>{title}</h2>
            </Link>

            <div>
              <div className="post-body">
                {body}
              </div>
              <p> </p>

              <div className="vote">
                <div
                  className="post-up-vote"
                  onClick={() => {this.props.onUpVotePost(postId)}}>
                </div>
                <h2>{voteScore}</h2>
                <div
                  className="post-down-vote"
                  onClick={() => {this.props.onDownVotePost(postId)}}>
                </div>
              </div>
            </div>

            <p>Category: {categoryName} | By: {author} | On: {dateMonthYear(timestamp)}</p>

            <div>
              <Link
                to={`/category/${this.props.categoryPath}`}
                onClick={() => {this.onDelete(postId)}}
              >
                Delete Post
              </Link>
                <Link
                  to={`/post/${postId}/edit`}
                  onClick={() => {this.props.onChangeView(`/post/${postId}/edit`, postId)
                }}>
                  Edit Post
                </Link>
            </div>
        </div>
        <hr />
        <h3>{commentCount} Comments</h3>
        <Comments />
      </div>
    );

  }
}

// TODO: how to use PropTypes ".isRequired" with redux store?
// const { object, func } = PropTypes;
Post.propTypes = {
  post: PropTypes.object//.isRequired,
}

function mapDispatchToProps(dispatch){
  return ({
    onChangeView:  (url, id) => dispatch(changeView({ currentUrl:url, currentId:id })),
    onUpVotePost:   (postId) => dispatch(upVotePost(postId)),
    onDownVotePost: (postId) => dispatch(downVotePost(postId)),

    changeViewByCategory: (category) => dispatch(changeView({ persistentCategory:category })),
    deletePost: (postId) => dispatch(deletePost(postId)),

    fetchPost: (id) => dispatch(fetchPost(id)),
    updateLocation: (uri) => dispatch(changeView({ uri: uri })),
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('Post store:', store);
  // console.log('Post ownProps:', ownProps);

  // const postId = store.viewData.currentId;
  const postId = //store.viewData.currentId ||  // primary source of truth due to asynch of url
    ownProps.routerInfo.match.params.PostId || null;  // fallback in case load from saved URL
    // console.log('Post mapStoreToProps, postId', postId);

  const post = store.posts[postId];

  // disambiguate: category is an object with name and path
  // but on a post category refers to the name only
  const categoryName = (post && post.category) || null;
  const categoryPath = (store.categories[categoryName] &&
                        store.categories[categoryName].path) || null;


  function getUri(routerInfo){
    const match    = (ownProps && ownProps.routerInfo && routerInfo.match)    || null;
    const location = (ownProps && ownProps.routerInfo && routerInfo.location) || null;
    return ({
      route:  match.path   || null,
      url:    match.url    || null,
      params: match.params || null,
      postId:       match.params.postId       || null,
      categoryPath: match.params.categoryPath || null,

      // TESTING to replace postId and categoryPath above
      currentId: match.params.postId || match.params.categoryPath || null,

      // TODO: store currentSort info in url (persistent shall still be in viewData)
      // search: location.search || null,

      //TODO: so can link to location on page (top of comments, add comment, etc)
      // hash:   location.hash   || null,
    })
  }

  const uri = getUri(ownProps.routerInfo) || null;

  // console.log('__Post, uri:', uri);

  return {
    postId: uri.postId,
    post:   store.posts[uri.postId],
    // categoryPath,

    // if loaded from saved URL
    uri,
    viewDataUrl: store.viewData.currentUrl || null,
    viewDataId:  store.viewData.currentId  || null,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Post);




    // TODO IF post isn't in store, fetch it.
    // props post accessed by query string
    // https://github.com/ReactTraining/react-router/issues/4036

    // const { post } = props.location.state;
    // // prop passed in from a Link component
    // // https://stackoverflow.com/a/45599159/5411817

