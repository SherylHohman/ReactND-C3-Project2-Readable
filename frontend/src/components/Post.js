 import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import { changeView, HOME, getUri } from '../store/viewData';
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
    }

    if (this.props.uri){
      console.log('__Post cDM calling changeView, this.props.uri', this.props.uri);
      this.props.changeView(this.props.uri)
    }
    else {
      console.log('__Post cDM NOT calling changeView, this.props.uri', this.props.uri);

    }
  }

  componentWillReceiveProps(nextProps){
    // maybe check for 404 (deleted postId, bad postId), or network error here ?
  }

  onDelete(postId){
    // must call deletePost before changeView
    this.props.deletePost(postId);
    // Link redirects to category that this post previously appeared
    // viewData musht store this same info to keep in synch
    // Not Dry :/ - TODO: read and parse data from URL routes

    // const category = {
    //   name: this.props.post.category,
    //   path: this.props.categoryPath,
    // }
    // this.props.changeViewByCategory(category);
  }

  render(){

    const props = this.props;
    if (!this.props){console.log('Post props is undefined');}

    // TODO: show error message if error fetching post:
    //  post Deleted, bad PostId, or network error
    //  options: 404, retry, homePage

    if (!this.props.post) {
      // console.log('Post: post wasn\'t present in props, do I have the postID?:', this.props.postId);
      return (
        <div>
          <p>looking for your Post:</p>
        </div>
      )
    }

    const postId = this.props.postId;
    const {title, body, voteScore, commentCount, author, timestamp } = this.props.post;

    // disambiguate:
    // category is an {name, path} object on categories, yet
    // category on a post refers to a category.name
    const categoryName = this.props.post.category;
    const categoryPath = this.props.categoryPath;

    return (
      <div>
        <div>
            <Link
              to={`/post/${postId}`}
                /*onClick={() => {this.props.onChangeView(`/post/${postId}`, postId)}*/
            >
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
                to={`/category/${categoryPath}`}
                onClick={() => {this.onDelete(postId)}}
              >
                Delete Post
              </Link>
                <Link
                  to={`/post/${postId}/edit`}
                    /*onClick={() => {this.props.onChangeView(`/post/${postId}/edit`, postId)}*/
                >
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
    changeView:  (uri) => dispatch(changeView({ uri })),
    // onChangeView:  (url, id) => dispatch(changeView({ currentUrl:url, currentId:id })),
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

  const uri = getUri(ownProps.routerInfo) || null;
  const postId = uri.postId  || null;
  // so can redirect to Post's (former) category when deleting the post
  const categoryPath = (store.categories[postId] && store.categories[postId].path) || null;


  return {
    postId,
    post: store.posts[postId],
    categoryPath,

    // uri: {url, route, params, currentId}
    // uri.params is either: postId OR categoryPath  //currentId replaces postId & categoryPath
    uri,

    // so don't have to refactor former history.push references (if have bad postId)
    history: ownProps.routerInfo.history
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Post);
