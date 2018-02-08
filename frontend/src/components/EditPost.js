import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
      havePostId = (postId === '') || (postId === null) //|| (postId.length<20)
        ? false : true;
    }

    // console.log('havePostId:', havePostId, 'postId:', postId, 'havePost:', havePost);

    if (!havePostId && !havePost){
      // this.loadHomePage();
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

  // loadHomePage(){
  //   // use when cannot get the post, (not in store/props, could not fetch/nopostId)

  //   // null id will load persistent category, use
  //   // HOME.id to load AllCategories
  //   this.props.changeView(HOME.url, null);
  //   this.props.history.push(HOME.url);
  // }

  onSave(){
    //  sending only changed values, rather than the whole post, hence the name
    // console.log('___onSave EditPost');
    // console.log('state:', this.state, 'this.props.categories', this.props.categories);

    const editedPostData = {
      title: this.state.title,
      category: this.state.categoryName,
      body: this.state.body,
    }
    this.props.onSave(this.props.postId, editedPostData);
    // console.log('onSave:, editedPostData', editedPostData);

    const category = this.props.categoriesObject[this.state.categoryName]
    this.props.changeViewByCategory(category);
  }

  onCancel(){
    const postId = this.props.postId;
    const postUrl = `/post/${postId}`;

    this.props.changeView(postUrl, postId);
  }

  render(){

    // if (this.props.postId === '' || this.props.postId === null){
    //   return (
    //     <div>
    //       <p>I do not know that post id.. Can you find it for me ?</p>
    //       <p> ..going to the home page now ;-D </p>
    //       <Redirect to="/" />
    //     </div>
    //   )
    // }

    const postId = this.props.postId;
    const postUrl = `/post/${postId}`;
    // console.log('render, postId:', postId, 'postUrl:', postUrl);

    //   if (!this.props || !this.props.post || !this.props.post.id){
    //   return (
    //     <div><h2> Hold On.. I'm getting your Post </h2></div>
    //   )
    // }

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
                className="edit-category"
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
          <div className="edit-active">
            <h4> Rendered Edited post </h4>
            <h3> {this.state.title} </h3>
            <p>  Category: {this.state.categoryName}  </p>
            <p>  {this.state.body}  </p>
          </div>
          <hr />
          <hr />
          <div className="edit-orig">
            <p> Original Post </p>
            <h3> {this.props.post.title} </h3>
            <p> Category: {this.props.post.category}  </p>
            <p> {this.props.post.body}  </p>
          </div>
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

