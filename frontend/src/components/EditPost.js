import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { editPost } from '../store/posts';
import { changeView, HOME } from '../store/viewData';
import { fetchPost } from '../store/posts';
import PropTypes from 'prop-types';


export class EditPost extends Component {

  state = {
    title: '',
    body:  '',
    categoryName: '',
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
      havePost = false;
      havePostId = false;
    }
    else {
      postId = this.props.postId;
      havePostId = (!postId) //|| (postId.length<20) // magic number: length of id
        ? false : true;
    }

    console.log('havePostId:', havePostId, 'postId:', postId, 'havePost:', havePost);

    if (!havePostId && !havePost){
      this.loadHomePage();
    }

    if (havePostId && !havePost){
      console.log('in EditPost, going to fetchPost for postId:', postId, havePostId, havePost)
        this.props.fetchPost(postId)
    }

    if (havePost) {
      // init controlled input fields
      this.setState({
        title: this.props.post.title,
        body : this.props.post.body,
        categoryName: this.props.post.category,
      });
      // (if !havePostId) just to be complete - no holes left open. Unlikely, but..
      postId = this.props.post.id;  // make sure postId and post data are synched !
    }

  }

  componentWillReceiveProps(nextProps){
    if (this.props.post.category !== nextProps.post.category){
      this.setState({
        title: nextProps.post.title,
        body: nextProps.post.body,
        category: nextProps.post.category,
      })
    }
  }

  controlledTitleField(e, currentText){
    this.setState({title: currentText});
  }
  controlledBodyField(e, currentText){
    this.setState({body: currentText});
  }
  controlledCategoryField(categoryName){
    this.setState({ categoryName });
  }

  loadHomePage(){
    // use if cannot get the post, (not in store/props, could not fetch/nopostId)

    // null id will load persistent category,
    // HOME.id will load All Categories
    this.props.changeView(HOME.url, null);
    this.props.history.push(HOME.url);
  }

  setPostView(postUrl){
    // postUrl purpose is to ensure changeView uses the same as Link to""
    this.props.changeView(postUrl, this.props.postId);
  }

  onSave(postUrl){
    //  sending only changed values, rather than the whole post, hence the name
    const editedPostData = {
      title: this.state.title.trim(),
      category: this.state.categoryName,
      body: this.state.body.trim(),
    }
    this.props.onSave(this.props.postId, editedPostData);
    this.setPostView(postUrl);
  }

  onCancel(postUrl){
    this.setPostView(postUrl)
  }

  render(){

    // // if (this.props.postId === '' || this.props.postId === null){
    // if (!this.props.postId){
    //   console.log('EditPost render, !postId, redirecting Home');
    //   // should redirect to home or last viewed category page
    //   // in that case, change HOME.id to null
    //   this.props.changeView(HOME.url, HOME.id);
    //   return (
    //     <div>
    //       <p>I do not know that post.. Can you find it for me ?</p>
    //       <p> ..going to the home page now ;-D </p>
    //       <Redirect to={HOME.url} />
    //     </div>
    //   )
    // }

    const postId = this.props.postId;
    const postUrl = `/post/${postId}`;

    if (!this.props || !this.props.post || !this.props.post.id){
      return (
        <div><h2> Hold On.. I'm getting your Post </h2></div>
      )
    }

    return  (
      <div>
        <form className="edit">
          {/* uses state */}
          <input
            className="edit-title"
            type="text"
            value={this.state.title}
            onChange={ (event) => {this.controlledTitleField(event, event.target.value)} }
            style={{width:'100%'}}
            />

          <textarea
            className="post-body"
            type="text"
            value={this.state.body}
            onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
            style={{width:'98%'}}
            rows={'5'}
            />

            <div>
              <select
                className="category"
                value={this.state.categoryName}
                onChange={(e)=>this.controlledCategoryField(e.target.value)}
                >
                {this.props.categoryNames.map((categoryName) => {
                  return (
                    <option key={categoryName} value={categoryName}>{categoryName}</option>
                  )
                })}
              </select>
            </div>

          <Link
            to={postUrl}
            onClick={() => {this.onSave(postUrl)}}
            >
            <button>Save</button>
          </Link>
          <Link
            to={postUrl}
            onClick={() => {this.onCancel(postUrl)}}
            >
            <button>Cancel</button>
          </Link>
        </form>
          <hr />
          {/* uses props */}
          {/* TODO: css to make orig in light gray and smaller. Make above larger*/}
          <div className="render-edit">
            <h4> Rendered Edited post </h4>
            <h3> {this.state.title} </h3>
            <p>  {this.state.body}  </p>
            <p>  Category: {this.state.categoryName}</p>
          </div>
          <hr />
          <hr />
          { this.props.post && (
            <div className="render-orig">
              <p> Original Post </p>
              <h3> {this.props.post.title} </h3>
              <p>  {this.props.post.body}  </p>
              <p> Category: {this.props.post.category}</p>
            </div>
          )}
      </div>
    )
  };

}

EditPost.propTypes = {
    // TODO: how to make required, when using redux.store
    // TODO: how to require specific keys to exist on an (required) object
    postId: PropTypes.string,
    post : PropTypes.object,    // required keys: title, body, category
    categoryNames: PropTypes.array,
    categoriesObject: PropTypes.object,
    // history: PropTypes.object,
}

function mapDispatchToProps(dispatch){
  return ({
    onSave: (postId, editedPostData) => dispatch(editPost(postId, editedPostData)),
    changeView: (url, id) => dispatch(changeView({ currentUrl:url, currentId:id })),
    changeViewByCategory: (category) => dispatch(changeView({ persistentCategory:category })),
    fetchPost:  (postId) => dispatch(fetchPost(postId)),
  })
}

function mapStoreToProps ( store, ...ownProps ) {
  // console.log('store:', store)

  const postId = store.viewData.currentId;
  const categoryNames = Object.keys(store.categories).reduce((acc, categoryKey) => {
    return acc.concat([store.categories[categoryKey].name]);
  }, []);
  return {
    categoriesObject: store.categories,
    categoryNames,
    postId,
    post: store.posts[postId],
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(EditPost);


//   If page is loaded from saved url: Store is empty. Redirect to home page. Instead...
//   TODO: perhaps I can read it from viewData.selected (aka props.postId), or viewData.url
//   TODO: better solution: read post id from the url, then fetch the post.

