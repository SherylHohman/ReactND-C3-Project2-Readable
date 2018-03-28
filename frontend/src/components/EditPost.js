import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// dispatch functions
import { changeView } from '../store/viewData/actionCreators';
import { editPost }  from '../store/posts/actionCreators';
import { fetchPost } from '../store/posts/actionCreators';

// Components
import FetchStatus from './FetchStatus';

// Selectors
import { getPostsAsObjects, getFetchStatus } from '../store/posts/selectors';
import { getFetchStatus as getCategoriesFetchStatus} from '../store/categories/selectors';
import { getCategoryNames, getCategoriesObject } from '../store/categories/selectors';
import { getLoc } from '../store/viewData/selectors';
import { computeUrlFromParamsAndRouteName } from '../store/viewData/selectors';

// helpers and constants
import { titleCase } from '../utils/helpers';
import PropTypes from 'prop-types';


export class EditPost extends Component {

  state = {
      title:        '',
      body:         '',
      categoryName: '',
      author:       '',   //  TODO: assign the value of 'LoggedInUser'

    initialValues: {
      title:        '',
      body:         '',
      categoryName: '',
      author:       '',   //  TODO: assign the value of 'LoggedInUser'
    },

    // though an empty field is invalid, don't want to highlight them RED
    // at page load. instead only "invalidate" the field once it's been "touched"
    validField: {
      title:        true,
      body:         true,
      categoryName: true,
      author:       true,
    },
  }

  componentDidMount(){
    this.props.changeView(this.props.routerProps);
    if (!this.props.post) {
      // needed when page is loaded from a saved url
      this.props.fetchPost(this.props.postId);
    }
    else {
      this.initializeStateFields(this.props.post);
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.post !== this.props.post){
      this.initializeStateFields(nextProps.post);
    }
  }

  initializeStateFields(post){
    const { title, body, category, author } = post;
    this.setState({
        title,
        body,
        categoryName:  category,
        author,

      // also stash these values to see if input has changed before saving
      initialValues: {
        title,
        body,
        categoryName: category,
        author,
      },
    });
  }

  canSubmit(){
    const keys = Object.keys(this.state.validField);

    const allDataIsValid =  keys.every((key) => {
      return this.state.validField[key];
    })
    const dataHasChanged = keys.some((key) => {
      // return this.state[key].trim() !== this.state.initialValues[key];
      return this.state[key] !== this.state.initialValues[key];
    })

    return allDataIsValid && dataHasChanged;

  }
  validateField(key, newText){
    // setState is async, so cannot use state's value.
    // validate on newText instead (the value sent to setState)

    const isValid = !!newText;  // !! empty string, null, undefined

    this.setState({
      validField: {
        ...this.state.validField,
        [key]: isValid,
      },
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

  onSave(postUrl){
    //  sending only changed values, rather than the whole post, hence the name
    const editedPostData = {
      title:    this.state.title.trim()  || '(untitled)',
      category: this.state.categoryName  || this.props.categoryNames[0],
      body:     this.state.body.trim()   || '(blank)',
      author:   this.state.author.trim() || '(anonymous)',
      // TODO: automatically populate author from logged in user
    }

    // 1) make keys match between initialValues and editedPostData
    // 2) saving as new object as "this.state" cannot be read in `some` as written
    let initialValues = {...this.state.initialValues};
    initialValues["category"] = initialValues["categoryName"];
    delete initialValues["categoryName"];

    // wWile canSave checks if the fields have changed, I found it confusing (to the user)
    //   that adding a trailing space did *not* enable the Save Button.
    //   so I took away the trim() comparison in `canSave`, so the user can "Save".
    // Instead, I'll silently not save.  Data is always trimmed before Saving.
    //   So, I run another check here, this time against trimemd fields, as saved.
    //   I do *not* want to re-save a post if the saved data will be no different.
    //   Saves a network request, and (potentially saves an unnecessary re-render),

    const keys = Object.keys(editedPostData);
    const hasChanged = keys.some((key) => {
      return editedPostData[key] !== initialValues[key];
    })

    if (hasChanged) {
      this.props.onSave(this.props.postId, editedPostData);
    }
  }

  render(){

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
    post : PropTypes.object,       // required keys: title, body, category
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

  const postId = getLoc(ownProps.routerProps).postId || null;
  const post   = getPostsAsObjects(store)[postId]    || null;

  return {
    categoriesObject:      getCategoriesObject(store),
    categoryNames:         getCategoryNames(store),
    postId,
    post,
    fetchStatus:           getFetchStatus(store),
    categoriesFetchStatus: getCategoriesFetchStatus(store),
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(EditPost);
