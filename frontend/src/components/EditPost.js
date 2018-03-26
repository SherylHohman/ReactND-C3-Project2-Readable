import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// dispatch functions
import { changeView } from '../store/viewData/actionCreators';
import { fetchPost } from '../store/posts/actionCreators';
import { editPost }  from '../store/posts/actionCreators';

// Components
import FetchStatus from './FetchStatus';

// Selectors
import { getLoc } from '../store/viewData/selectors';
import { getPostsAsObjects, getFetchStatus } from '../store/posts/selectors';
import { getFetchStatus as getCategoriesFetchStatus} from '../store/categories/selectors';
import { getCategoryNames, getCategoriesObject } from '../store/categories/selectors';
import { computeUrlFromParamsAndRouteName } from '../store/viewData/routes';

// helpers and constants
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

    this.props.changeView(this.props.routerProps);

    if (!this.props.post) {
      // needed when page is loaded from a saved url
      this.props.fetchPost(this.props.postId);
    }
    else {
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
        categoryName: nextProps.post.category,
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
    // setState is async, so cannot use state's value
    // hence validating on newText (the value setState is setting the field to)
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
      title: this.state.title.trim()    || '(untitled)',
      category: this.state.categoryName || this.props.categoryNames[0],
      body: this.state.body.trim()      || '(blank)',

      // TODO: automatically populate author from logged in user
      author: this.state.author.trim()  || '(anonymous)',
    }
    this.props.onSave(this.props.postId, editedPostData);
  }

  render(){
    // console.log('postId:', this.props.postId, 'post:', this.props.post);

    const postId = this.props.postId;

    // loading "spinner", fetch failure, or 404
    if (!this.props.post) {
      return (
        <FetchStatus routerProps={ this.props.routerProps }
          fetchStatus={this.props.fetchStatus}
          label={'post to edit'}
          item={this.props.post}
          retryCallback={()=>this.props.fetchPost(postId)}
        />
      );
    }

    // const postUrl = `${ROUTES.post.base}${postId}`;
    const makePostUrl = () => {
      // first render state will have invalid values - early return
      // also need to wait for asynch fetching et al
      if (!this.state.categoryName || !this.props.categoriesObject ||
          !this.props.categoriesObject[this.state.categoryName] ||
          !this.props.categoriesObject[this.state.categoryName].path
          ){
        return '';
      }

      const params = {
        postId: this.props.postId,
        categoryPath: this.props.categoriesObject[this.state.categoryName].path
      };
      const routeName = 'post';
      const postUrl   = computeUrlFromParamsAndRouteName(params, routeName);
      return postUrl
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
            to={makePostUrl()}
            >
            <button
              className={canSubmit ? "on-save" : "has-invalid-field"}
              onClick={() => {this.onSave();}}
              disabled={!canSubmit}
              type="button"
              >Save
            </button>
            <button type="button"
              >Cancel
            </button>
          </Link>

        </form>

          <hr />
          {/* uses props */}
          <div className="edited">
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
    changeView: (routerProps) => dispatch(changeView(routerProps)),
    fetchPost:  (postId) => dispatch(fetchPost(postId)),
  })
}

function mapStoreToProps ( store, ownProps) {
  // console.log('EditPost.mSTP  store:', store)
  // console.log('EditPost.mSTP  ownProps', ownProps);

  const postId = getLoc(store, ownProps.routerProps).postId || null;
  const post = getPostsAsObjects(store)[postId] || null;

  const categoriesObject = getCategoriesObject(store);
  const categoryNames =    getCategoryNames(store);
  return {
    categoriesObject, //:   getCategoriesObject(store),
    categoryNames,    //:   getCategoryNames(store),
    postId,
    post,
    fetchStatus: getFetchStatus(store),
    categoriesFetchStatus: getCategoriesFetchStatus(store),
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(EditPost);
