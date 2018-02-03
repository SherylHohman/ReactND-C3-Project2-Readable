import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { editPost } from '../state/posts/ducks';
import { changeView } from '../state/viewData/ducks';
import { fetchPost } from '../state/posts/ducks';
import PropTypes from 'prop-types';


export class EditPost extends Component {

  state = {
    title: '',
    body:  '',
    category: '',
  }

  componentDidMount(){
    console.log('in EditPost componentDidMount');

    let havePost = true;
    let havePostId = true;
    let postId = null;

    if (!this.props || !this.props.post ||
         this.props.post === null ||
         this.props.post === {} ||
         !this.props.post.id) {
      // console.log('..componentDidMount, EditPost: props has no post');
      havePost = false;
      havePostId = false;

    }
    else {
      postId = this.props.postId;
      havePostId = (postId === '') || (postId === null) //|| (postId.length<16)
        ? false : true;
    }

    if (!havePostId && !havePost){
      this.loadHomePage();
      // console.log('EditPost CDM, no postId, no post, ..returning home')
    }

    if (havePostId && !havePost){
        this.props.fetchPost(postId)
        // console.log('__fetching post, postId', postId);
    }

    if (havePost) {
      // controlled input fields
      this.setState({
        title: this.props.post.title,
        body : this.props.post.body,
        category: this.props.post.category,
      });
      // (if !havePostId) just to be complete - no holes left open. Unlikely, but..
      postId = this.props.post.id;  // make sure postId and post data are synched !
    }

  }

  componentWillReceiveProps(nextProps){
    // console.log('__componentWillReceiveProps, nextProps', nextProps);
    if (this.props.post.category !== nextProps.post.category){
      this.setState({
        title: nextProps.post.title,
        body: nextProps.post.body,
        category: nextProps.post.category,
      })
    }
    // Whoah ! did that actually work ?? !!  Yes! app re-rendered! Finally!! :-)
  }

  controlledTitleField(e, currentText){
    // prevent default ?
    this.setState({title: currentText});
  }
  controlledBodyField(e, currentText){
    // prevent default ?
    this.setState({body: currentText});
  }
  controlledCategoryField(selectedCategory){
    // prevent default ?
    this.setState({category: selectedCategory});
  }

  loadHomePage(){
    // used when cannot get the post, (not in store/props, could not fetch/nopostId)

    // These are the values viewData is initialized with for the home page.
    const selectedItem = '';
    const postUrl = '/';

    this.props.onChangeView(postUrl, selectedItem);
    this.props.history.push(postUrl);
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
    //  sending only changed values, rather than the whole post, hence the name
    const editedPostData = {
      title: this.state.title,
      category: this.state.category,
      body: this.state.body,
    }

    this.props.onSave(this.props.postId, editedPostData);
    this.returnToPost();
  }

  render(){

    // if ((!this.props || !this.props.post || this.props.post === null) ||
    //    (this.state.title === '' && this.state.body === '' && this.state.category === '')) {
    // //   console.log('Post: post wasn\'t present in props, hopefully, will attempt to fetch it');

    if (this.props.postId === '' || this.props.postId === null){
      return (
        <div>
          <p>I do not know that post id.. Can you find it for me ?</p>
          <p> ..going to the home page now ;-D </p>
          <Redirect to="/" />
        </div>
      )
    }

    const postId = this.props.postId;
    const postUrl = `/post/${postId}`;
    const categories = this.props.categories.map(category => category.name);

      if (!this.props || !this.props.post || !this.props.post.id){
      return (
        <div><h2> Hold On.. I'm getting your Post </h2></div>
      )
    }

    return  (
      <div>
        <form>
          {/* uses state */}
          <input
            className="edit-title"
            type="text"
            value={this.state.title}
            onChange={ (event) => {this.controlledTitleField(event, event.target.value)} }
            />

            <div>
              <select
                value={this.state.category}
                onChange={(e)=>this.controlledCategoryField(e.target.value)}
                >
                {categories.map((category) => {
                  return (
                    <option key={category} value={category}>{category}</option>
                  )
                })}
              </select>
            </div>

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
        </form>
          <hr />
          {/* uses props */}
          {/* TODO: css to make orig in light gray and smaller. Make above larger*/}
          <h4> Rendered Edited Post </h4>
          <h3> {this.state.title} </h3>
          <p>  Category: {this.state.category}  </p>
          <p>  {this.state.body}  </p>
          <hr />
          <h4> Original Post </h4>
          <p> {this.props.post.title} </p>
          <p>  Category: {this.props.post.category}  </p>
          <p>  {this.props.post.body}  </p>
      </div>
    )
  };

}

EditPost.propTypes = {
    // TODO: how to make required, when using redux.store
    // TODO: how to require specific keys exist on an (required) object
    postId: PropTypes.string,
    post : PropTypes.object,    // required keys: title, body, category
    categories: PropTypes.array,
    history: PropTypes.object,
}

function mapDispatchToProps(dispatch){
  return ({
    onSave: (postId, editedPostData) => dispatch(editPost(postId, editedPostData)),
    onChangeView: (url, selected) => dispatch(changeView({ url, selected })),
    fetchPost:  (postId) => dispatch(fetchPost(postId)),
    // fetchPosts: (postId) => dispatch(fetchPosts()),
  })
}

function mapStoreToProps ( store ) {
  const postId = store.viewData.selected;
  // TODO: categories is an array on store. It *should* be an object of objects.
  console.log('categories:', store.categories);
  console.log('data', store.categories.categories);

  const categoriesArray = store.categories.categories;
  console.log('categoriesArray:', categoriesArray);
  // const categoryNames = categoriesArray.map((category) => {return category.name});

  // const categories = store.categories.categories.map(category => category.name);
  return {
    postId: store.viewData.selected || null,
    post: store.posts[postId] || null,
    categories: categoriesArray || null,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(EditPost);


//   If page is loaded from saved url: Store is empty. Redirect to home page.
//   TODO: perhaps I can read it from viewData.selected (aka props.postId), or viewData.url
//   TODO: better solution: read post id from the url, then fetch the post.

