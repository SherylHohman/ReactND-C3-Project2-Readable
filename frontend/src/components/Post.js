 import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import { changeView, HOME, updateLocation } from '../store/viewData';
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
      updateLocation(this.props.uri)
    }
  }

  componentWillReceiveProps(nextProps){
    console.log('__Post, nextProps:', nextProps);

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

    const props = this.props;
    if (!this.props){
      console.log('Post props is undefined');
      // return null;
    }

    // TODO: if fetchPost is unsuccessful
    //  (ie: invalid postId, or deleted post, or network error)
    //  Display error message, and option to "retry" or redirect to Home

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
  })
}

function mapStoreToProps (store, ownProps) {
  console.log('Post store:', store);
  console.log('Post ownProps:', ownProps);

  // primary source of truth for PostId is now the url, not store,
  //  (due to asynch of (BrowserRouter) url, viewData url thus be out of synch
  //  with it. In fact, could remove viewData.currentUrl, viewData.currentId,
  //  except that it's handy to have the parsed value "cached"/stored, and we are
  //  not to pass a prop value around, but instead to use store alone.
  //  so, keeping the currentId in store for easy access, rather than re-parsing
  //  each time (postId or categoryName) is needed.
  //  This may change.

  const postId = ownProps.routerInfo.match.params.PostId || store.viewData.currentId || null;
  console.log('Post mapStoreToProps, postId', postId);

  const post = store.posts[postId];

  // disambiguate: category is an object with name and path
  // but on a post category refers to the name only
  const categoryName = (post && post.category) || null;
  const categoryPath = (store.categories[categoryName] &&
                        store.categories[categoryName].path) || null;


  const routerInfo = (ownProps && ownProps.routerInfo) || null;
  const uri = {
    route:  (routerInfo && routerInfo.match && routerInfo.match.path)   || null,
    url:    (routerInfo && routerInfo.match && routerInfo.match.url)    || null,
    params: (routerInfo && routerInfo.match && routerInfo.match.params) || null,
    postId: (routerInfo && routerInfo.match && routerInfo.match.params.postId) || null
    // search:    (routerInfo && routerInfo.location && routerInfo.location.search) || null,
    // hash:     (routerInfo && routerInfo.location && routerInfo.location.hash)  || null,
  }
  console.log('__Post, uri:', uri);

  return {
    postId: uri.postId,
    post:   store.posts[uri.postId],

    // if loaded from saved URL
    uri,
    // TODO: just compute this value directly from the url.  No need to save into store
    viewDataUrl: store.viewData.currentUrl || null,
    viewDataId:  store.viewData.currentId  || null,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Post);
