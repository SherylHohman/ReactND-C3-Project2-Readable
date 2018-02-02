import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { editPost } from '../state/posts/ducks';
import { changeView } from '../state/viewData/ducks';
// import { fetchPost } from '../state/posts/ducks';  // if don't have the post
import PropTypes from 'prop-types';


export class EditPost extends Component {

  state = {
    title: '',
    body:  '',
    category: '',
  }

  componentDidMount(){
    console.log('in EditPost componentDidMount');

    //  TODO: if postId not in store/state, then fetch it - could be from saved url
    if (!this.props || !this.props.post || this.props.post === null) {
      // TODO: fetchPost(this.props.postId) instead of history.push
      // this.state.history.push('/');
      console.log('..componentDidMount, EditPost: I have no post in props');
    }
    else {
      // controlled input fields
      this.setState({
        title: this.props.post.title,
        body : this.props.post.body,
        category: this.props.post.category,
      });
    }
  }

  controlledTitleField(e, currentText){
    // prevent default ?
    this.setState({title: currentText});
  }

  controlledBodyField(e, currentText){
    // prevent default ?
    this.setState({body: currentText});
  }

  returnToPost(){
    const postId = this.props.postId;
    const postUrl = `/post/${postId}`;

    this.props.onChangeView(postUrl, postId);
    // TODO: put and get history from Store, rather than passed as prop from Route
    this.props.history.push(postUrl);
  }
  onCancel(){
    this.returnToPost();
  }
  onSave(){
        // should I copy all post key/value fields, or only place the changed values
        // ...this.props.post,
        //  if copy entire post, pass it as "post",
        //  else pass the subset as "editedPostData"
    const editedPostData = {
      title: this.state.title,
      category: this.state.category,
      body: this.state.body,
    }

    this.props.onSave(this.props.postId, editedPostData);
    this.returnToPost();
  }

  render(){

    // if page loaded from saved url. Store is empty. Redirect to home page.
    //   TODO: better solution: read post id from the url, then fetch the post.
    //   TODO: even before I read url from post, sometimes I can read it from viewData!
    if (!this.props || !this.props.post || this.props.post === null) {
      console.log('Post: post wasn\'t present in props, redirecting to home page.');
      return (
        <div>
          <p>No post exists in props, redirecting to the home page.</p>
          <Redirect to="/" push />
        </div>
      )
    }

    // const post = this.props.post;
    const postId = this.props.postId;
    const postUrl = `/post/${postId}`;
    const { title, body, category } = this.props.post;
    console.log('state', this.state);

    return  (
      <div>
        <form>
          <input
            className="edit-title"
            type="text"
            value={this.state.title}
            onChange={ (event) => {this.controlledTitleField(event, event.target.value)} }
            />
          {/*category - should be drop down list of avail categories
          <input
            className="edit-post-category"
            type="text"
            value={this.state.body}
            onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
            />
            */}
          <input
            className="edit-post-body"
            type="text"
            value={this.state.body}
            onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
            />
          <Link
            to={postUrl}
            onClick={() => {this.onSave();}}
            >
            <button>Save</button>
          </Link>
          <Link
            to={postUrl}
            onClick={() => {this.onCancel();
            }}>
            <button>Cancel</button>
          </Link>
          <hr />
          {/* TODO: css to make orig in light gray and smaller. Make above larger*/}
          <h2> Orig Title: {title} </h2>
          <p>  Orig Category: {category}  </p>
          <p>  Orig Post: {body}  </p>
        </form>
      </div>
    )
  };

}

EditPost.propTypes = {
    // TODO: how to make required, when using redux.store
    // TODO: how to require specific keys exist on an (required) object
    postId: PropTypes.string,
    post : PropTypes.object,    // required keys: title, body, category
    history: PropTypes.object,
}

function mapDispatchToProps(dispatch){
  return ({
    onSave: (postId, editedPostData) => dispatch(editPost(postId, editedPostData)),
    onChangeView: (url, selected) => dispatch(changeView({ url, selected })),
  })
}

function mapStoreToProps ( store ) {
  const postId = store.viewData.selected;
  return {
    postId: store.viewData.selected || null,
    post: store.posts[postId] || null,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(EditPost);
