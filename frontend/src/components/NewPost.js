import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// dispatch functions
import { changeView } from '../store/viewData/actionCreators';
import { addPost } from '../store/posts/actionCreators';
import { fetchCategories } from '../store/categories/actionCreators';

// Selectors
import { getCategoryNames, getCategoriesObject } from '../store/categories/selectors';
import { getLocFrom } from '../store/viewData/selectors';

// helpers and constants
import { HOME, ROUTES } from '../store/viewData/constants';
import { createId, titleCase } from '../utils/helpers';


export class NewPost extends Component {

  state = {
    prevUrl:'',   // make sure this is ONLY updated in cDM, NOT cWRP

    title:  '',
    author: '',   //  TODO: assign the value of 'LoggedInUser'
    body:   '',
    categoryName: HOME.category.name,

    // though an empty field is invalid, don't want to highlight them RED
    // at page load. instead only "invalidate" the field once it's been "touched"
    validField: {
      title:  true,
      author: true,
      body:   true,
    },
    touchedField: {
      title:  false,
      author: false,
      body:   false,
    },
  }

  componentDidMount(){
    // setState and changeView are both asynch.
    // doubt changeView would ever finish BEFORE setState
    // but just in case: Make Sure THIS line occurs before changeView
    this.setState( {prevUrl: this.props.prevUrl} );

    this.props.changeView(this.props.routerProps);

    if (this.props.categoryName){
      this.setState( {categoryName: this.props.categoryName} );
    }
  }

  componentWillReceiveProps(nextProps){
    if ( nextProps.categoryName &&
         (nextProps.categoryName !== this.state.categoryName)
       ){
        this.setState( {categoryName: nextProps.categoryName} );
      }
  }

  canSubmit(){
    // all fields touched and valid
    const keys = Object.keys(this.state.validField);
    return keys.every((key) => {
      return this.state.touchedField[key] && this.state.validField[key];
    })
  }
  touchField(key){
    // mark this field changed by user (only show "invalid" if field was touched)
    this.setState({
      touchedField: {
        ...this.state.touchedField,
        [key]: true,
      }
    });
  }
  validateField(key, newText){
    // setState is async, so cannot validate on state's value of the field
    // hence validating on newText (the value setState is setting the field to)

    const isValid = !!newText;  // not empty string, null, undefined

    this.setState({
      validField: {
        ...this.state.validField,
        [key]: isValid,
      }
    });
  }
  updateFieldStatus(key, newTextValue){
    this.touchField(key);
    this.validateField(key, newTextValue)
  }

  controlledTitleField(e, currentText){
    e.preventDefault();
    this.setState({title: titleCase(currentText)});
    // passing in currentText to validate against, because setState is asynch!!
    this.updateFieldStatus("title", currentText)
    return false;
  }
  controlledBodyField(e, currentText){
    e.preventDefault();
    this.setState({body: currentText});
    // passing in currentText to validate against, because setState is asynch!!
    this.updateFieldStatus("body", currentText);
    return false;
  }
  controlledCategoryField(e, selected){
    this.setState({categoryName: selected});
  }
  controlledAuthorField(e, currentText){
    e.preventDefault();
    this.setState({author: titleCase(currentText)});
    // passing in currentText to validate against, because setState is asynch!!
    this.updateFieldStatus("author", currentText);
    return false;
  }

  loadHomePage(){
    const url = HOME.url;
    this.props.history.push(url);
  }

  loadCategoryPage(categoryName){
    const category = this.props.categoriesObject[categoryName] || HOME.category;
    const url = `${ROUTES.category.base}${category.path}` || HOME.url;
    this.props.history.push(url);
  }

  loadPostPage(categoryPath, postId){
    this.props.history.push(`${ROUTES.post.base}${categoryPath}/${postId}`);
  }

  onCancel(){
    this.props.history.push(this.state.prevUrl);
  }

  onSave(){
    // "Full" Post object has additional fields, initialized by the server.
    const newPostData = {
      id:     createId(),
      title:  this.state.title.trim()  || '(untitled)',
      body:   this.state.body.trim()   || '(blank)',

      // TODO: automatically populate author from logged in user
      author: this.state.author.trim() || '(anonymous)',
      category:  this.state.categoryName     ||
                 this.props.categoryNames[0] || HOME.category.name,
      timestamp: Date.now(),
    }

    this.props.onSave(newPostData);
    this.loadPostPage(newPostData.category, newPostData.id);
  }

  onSubmit(e){
    e.preventDefault();
    this.onSave();
  }

  render(){

    // TODO: refactor to use the FetchStatus component
    const renderCategoriesLoading = (
        <p> Hang on.. we're looking for the categories ! </p>
    )

    const renderSelectCategory = (
        <div>
           <select
            value={this.state.categoryName}
            onChange={(e)=>this.controlledCategoryField(e,e.target.value)}
            >
            {this.props.categoryNames.map((categoryName) => {
              return (
                <option key={categoryName} value={categoryName}>{titleCase(categoryName)}</option>
              )
            })}
          </select>
        </div>
    );

    const showCategoriesOrLoading = (this.state.categoryName !== HOME.category.name)
         ? renderSelectCategory
         : renderCategoriesLoading;

    const canSubmit = this.canSubmit();

    console.log('NewPost.render, re-rendering..');  // monitor for unnecessary re-renders
    return  (
      <div>

        <small>New Post</small>

            <form
              onSubmit={(e)=> {this.onSubmit(e)}}
              >

              <input
                component="input"
                className={this.state.validField.title ? "" : "invalid-field"}
                type="text"
                placeholder="Title"
                value={this.state.title}
                onChange={ (event) => {this.controlledTitleField(event, event.target.value)} }
              />

              <textarea
                className={this.state.validField.body ? "" : "invalid-field"}
                type="text"
                placeholder="Write Something"
                value={this.state.body}
                onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
                rows={'5'}
                />

              <input
                className={this.state.validField.author ? "" : "invalid-field"}
                type="text"
                placeholder="Your Name"
                value={this.state.author}
                onChange={ (event) => {this.controlledAuthorField(event, event.target.value)} }
                /* TODO: add user field on Home/Page, that auto populates author field */
                />

              <div>
                  {showCategoriesOrLoading}
              </div>

              <button
                type="button"
                className={canSubmit ? "on-save" : "has-invalid-field"}
                onClick={() => {this.onSave();}}
                disabled={!canSubmit}
                >
                Save
              </button>
              <button
                className="on-cancel"
                onClick={() => {this.onCancel();}}
                type="button"
                >
                Cancel
              </button>
            </form>

        <hr />
        {/* uses props */}
        <h3> {this.state.title} </h3>
        <p>  {this.state.body}  </p>

        {/* categories may need to be fetched */}
        {((this.state.categoryName === HOME.category.name) &&
          <p>-</p>
         ) || (
          <p>  Category: {titleCase(this.state.categoryName)}  </p>
         )
        }
        <p>  Authored by: {this.state.author}  </p>
        <hr />

      </div>
    )
  };

}

NewPost.propTypes = {
// TODO: how to make required, when using redux.store
// TODO: how to require specific keys to exist on an (required) object
  categories: PropTypes.array,
     history: PropTypes.object,
}

function mapDispatchToProps(dispatch){
  return ({
    changeView: (routerProps) => dispatch(changeView(routerProps)),
    fetchCategories:  (postId) => dispatch(fetchCategories(postId)),
    onSave: (newPostData) => dispatch(addPost(newPostData)),
  })
}

function mapStoreToProps (store, ownProps) {
  const history = (ownProps.routerProps && ownProps.routerProps.history )|| null;

  // save last PAGE visited so can return to it on cancel
  // gets saved to STATE at (FIRST PAGE LOAD ONLY), because props.prevUrl gets
  //   overwritten with the url of *this* page, when this component re-renders
  //   (because mounting this page triggers the store to be updated to this url)
  const prevUrl = getLocFrom(store).url || HOME.url;

  const categoriesObject = getCategoriesObject(store);
  const categoryNames    = getCategoryNames(store);

  // set an default value
  // TODO: add a "Select Category.." option, and set it as the default instead
  const categoryName  = categoryNames[0] || HOME.category.name;

  return {
    categoriesObject,
    categoryNames,
    categoryName,
    history,
    prevUrl,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(NewPost);
