import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { editPost } from '../state/posts/ducks';
import { changeView } from '../state/viewData/ducks';
// import { fetchPost } from '../state/posts/ducks';  // if don't have the post
import PropTypes from 'prop-types';


export class EditPost extends Component {

  state = {
    title: '',
    body:  '',
  }

  componentDidMount(){

    //  TODO: if postId not in store/state, then fetch it - could be from saved url

    if (!this.props || !this.props.post || this.props.post === null) {
      // TODO: fetchPost(this.props.postId) instead of history.push
      console.log('componentDidMount, EditPost: I have no post in props');
      // this.state.history.push('/');
    }
    else {
      console.log('props', this.props);
      // controlled input fields
      this.setState({
        title: this.props.post.title,
      });
      this.setState({
        body : this.props.post.body,
      });
      console.log('state', this.state);
    }
  }

  render(){
    console.log('in EditPost');

    // page probably loaded from saved url. Store is empty. Redirect to home page.
    //   TODO: better solution: read post id from the url, then fetch the post.
    if (!this.props || !this.props.post || this.props.post === null) {
      console.log('Post: post wasn\'t present in props, redirecting to home page.');
      return (
        <div>
          <p>No post exists in props, redirecting to the home page.</p>
          <Redirect to="/" push />
          <button>Save</button>
          <button>Cancel</button>
        </div>
      )
    }

    const post = this.props.post;
    // const postId = this.props.post.id;
    const postId = this.props.postId;
    const postUrl = `/post/${postId}`;
    const { title, body } = this.props.post;

    return  (
      <div>
        <h2> {title} </h2>
        <p>  {body}  </p>
      </div>
    )
  };

}

EditPost.propTypes = {
    postId: PropTypes.string,
    // post : PropTypes.object,
    // post.body: PropTypes.string,
    // post.title: PropTypes.string,
}

function mapDispatchToProps(dispatch){
  return ({
    onSave: (post) => dispatch(editPost(post)),  // rem to also changeView to post
    onCancel: (url, postId) => dispatch(changeView(url, postId)), // return to post
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
