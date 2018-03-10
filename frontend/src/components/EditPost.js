import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { editPost } from '../store/posts';
import { HOME, ROUTES } from '../store/viewData';
import { changeView, getUri } from '../store/viewData';
import { fetchPost } from '../store/posts';
import { titleCase } from '../utils/helpers';
import PropTypes from 'prop-types';


export class EditPost extends Component {

  state = {
    title: '',
    body:  '',
    categoryName: '',
    author: '',   //  TODO: assign the value of 'LoggedInUser'

    validField: {
      title:  true,
      author: true,
      body:   true,
    },
  }

  componentDidMount(){
    // console.log('in EditPost componentDidMount');

    if (!this.props.post) {
      // needed when page is loaded from a saved url
      this.props.fetchPost(this.props.postId);
    }
    else {
      // console.log('EditPost, cDM, post:', this.props.post);
      // init controlled input fields
      this.setState({
        title: this.props.post.title,
        body : this.props.post.body,
        categoryName: this.props.post.category,
        author: this.props.post.author,
      });
    }

  }

  componentWillReceiveProps(nextProps){
    if (this.props.post !== nextProps.post){
      this.setState({
        title: nextProps.post.title,
        body: nextProps.post.body,
        category: nextProps.post.category,
        author: nextProps.post.author,
      })
    }
  }

  canSubmit(){
    const keys = Object.keys(this.state.validField);
    return keys.every((key) => {
      return this.state.validField[key];
    })
  }
  validateField(key, newText){
    // setState is async, so cannot use it's value
    // hence passing and validating on newText (what setState is being set to)
    const isValid = !!newText;  // !! empty string, null, undefined
    this.setState({
      validField: {
        ...this.state.validField,
        [key]: isValid,
      }
    });
  }

  controlledTitleField(e, currentText){
    this.setState({title: titleCase(currentText)});
    this.validateField('title', currentText)
  }
  controlledBodyField(e, currentText){
    this.setState({body: currentText});
    this.validateField('body', currentText)
  }
  controlledCategoryField(categoryName){
    this.setState({ categoryName });
  }
  controlledAuthorField(e, currentText){
    this.setState({author: titleCase(currentText)});
    this.validateField('author', currentText)
  }

  // onSubmit(e){
  //   e.preventDefault();
  // }


  onSave(postUrl){
    //  sending only changed values, rather than the whole post, hence the name
    const editedPostData = {
      title: this.state.title.trim()   || '(untitled)',
      category: this.state.categoryName,
      body: this.state.body.trim()     || '(blank)',

      // TODO: automatically populate author from logged in user
      author: this.state.author.trim() || '(anonymous)',
    }
    this.props.onSave(this.props.postId, editedPostData);
  }

  render(){

    // console.log('postId:', this.props.postId, 'post:', this.props.post);

    // if (FETCH ERROR){
    //   // bad postId/deleted-post (likely form saved Url, or browser Back Button)
    //   // redirect/link to home or last viewed category page (persistentCategoryPath)
    //   return (
    //     <div>
    //       <p>I do not know that post.. Can you find it for me ?</p>
    //       <Link to={HOME.url}>
    //         <p>Take me to the home page ;-D </p>
    //       </Link>
    //     </div>
    //   )
    // }

    const postId = this.props.postId;
    const postUrl = `${ROUTES.post.base}${postId}`;

    if (this.props && this.props.postId && !this.props.post){
      // console.log('EditPost render, postId, but no Post');
      return (
        <div>
        <h2> Hold On.. I'm getting your Post </h2>
          {/* below is until get fetch error handling implemented (then use above section) */}
          <Link to={HOME.url}>
            <h3 style={{color: "red"}}> (..unless it doesn't exist..) </h3>
            <h3>Take me to the home page ;-D </h3>
          </Link>
        </div>
      )
    }

    const canSubmit = this.canSubmit();

    return  (
      <div>
        <form className="edit">
          {/* uses state */}
          <div>
            <p className="field-label-left">Title: </p>
            <input
              className={this.state.validField.title ? "" : "invalid-field"}
              type="text"
              placeholder="Title"
              value={this.state.title}
              onChange={ (event) => {this.controlledTitleField(event, event.target.value)} }
              />
          </div>

          <div>
           <p className="field-label-left">Body: </p>
            <textarea
              className={this.state.validField.body ? "" : "invalid-field"}
              type="text"
              placeholder="Write Something"
              value={this.state.body}
              onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
              rows={'5'}
              />
          </div>

          <div>
            <p className="field-label-left">Your Name: </p>
            <input
              className={this.state.validField.author ? "" : "invalid-field"}
              type="text"
              placeholder="Your Name"
              value={this.state.author}
              onChange={ (event) => {this.controlledAuthorField(event, event.target.value)} }
              /* TODO: add user field on Home/Page, that auto populates author field */
              />
          </div>

          <div className="field-label-left">
          <span> Category: </span>
            <select
              className="category"
              value={this.state.categoryName}
              onChange={(e)=>this.controlledCategoryField(e.target.value)}
              >
              {this.props.categoryNames.map((categoryName) => {
                return (
                  <option
                    key={categoryName}
                    value={categoryName}>{titleCase(categoryName)}
                  </option>
                )
              })}
            </select>
          </div>

          <Link
            to={postUrl}
            >
            <button
              className={canSubmit ? "on-save" : "has-invalid-field"}
              onClick={() => {this.onSave();}}
              disabled={!canSubmit}
              >Save
            </button>
            <button>Cancel</button>
          </Link>

        </form>

          <hr />
          {/* uses props */}
          <div className="edited">
            {/* <h4> Edited post </h4> */}
            <h3> {this.state.title} </h3>
            <p className="post-body">  {this.state.body}  </p>
            <p className="italic">  Category: {this.state.categoryName}</p>
          </div>
          <hr />
          <hr />
          { this.props.post && (
            <div className="orig">
              <p> Original Post </p>
              <h3> {this.props.post.title} </h3>
              <p className="post-body">  {this.props.post.body}  </p>
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
    categoriesObject: PropTypes.object,
    categoryNames: PropTypes.array,
    postId: PropTypes.string,
    post : PropTypes.object,    // required keys: title, body, category
    fetchPost: PropTypes.func,
    editPost: PropTypes.func,
    changeView: PropTypes.func,
    routerProps: PropTypes.object, // needs match, (maybe location, history.push)
}

function mapDispatchToProps(dispatch){
  return ({
    onSave: (postId, editedPostData) => dispatch(editPost(postId, editedPostData)),
    changeView: (url, id) => dispatch(changeView({ currentUrl:url, currentId:id })),
    changeViewByCategory: (category) => dispatch(changeView({ persistentCategory:category })),
    fetchPost:  (postId) => dispatch(fetchPost(postId)),
  })
}

function mapStoreToProps ( store, ownProps) {
  // console.log('store:', store)

  // const postId = store.viewData.currentId;
  // if parent component does not pass down routerProps, pass "store" as 2nd param as a fallback
  // const postId = getUri(null, store).currentId;  //postId not returned when passing "store"
  const postId = getUri(ownProps.routerProps).postId || null;//currentId;

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
