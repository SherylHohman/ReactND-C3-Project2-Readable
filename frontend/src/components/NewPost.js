import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addPost } from '../store/posts';
import { HOME, ROUTES } from '../store/viewData';
import { fetchCategories } from '../store/categories';
import { createId, titleCase } from '../utils/helpers';
import PropTypes from 'prop-types';


export class NewPost extends Component {

  state = {
    title:  '',
    author: '',   //  TODO: assign the value of 'LoggedInUser'
    body:   '',
    categoryName: HOME.category.name,

    // though an empty field is invalid, don't want to highlight it as such
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
    }
  }

  componentDidMount(){
    // console.log('in NewPost componentDidMount');

    if (this.props.categoryNames){
      this.setState( {categoryName: this.props.categoryNames[0] });
    }
  }

  componentWillReceiveProps(nextProps){
    // console.log('EditPost componentWillReceiveProps, nextProps:', nextProps);

    // categories never change in life of app, they are fetched at App load
    if ( nextProps &&
         nextProps.categoryNames &&
         Array.isArray(nextProps.categoryNames) &&
         nextProps.categoryNames[0]
       ){
          // default: initialize "selected" category to the first in the list
          this.setState({
            categoryName: nextProps.categoryNames[0],
          })
      }
  }

  canSubmit(){
    const keys = Object.keys(this.state.validField);
    return keys.every((key) => {
      return this.state.touchedField[key] && this.state.validField[key];
    })
  }
  fieldTouched(key){
    this.setState({
      touchedField: {
        ...this.state.touchedField,
        [key]: true,
      }
    });
  }
  validateField(key, newText){
    // setState is async, so cannot use it's value
    // hence passing and validating on newText (what setState is being set to)
    const isValid = !!newText;  // not empty string, null, undefined
    this.setState({
      validField: {
        ...this.state.validField,
        [key]: isValid,
      }
    });
  }
  updateFieldStatus(key, newTextValue){
    this.fieldTouched(key);
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

  loadPostPage(postId){
    this.props.history.push(`${ROUTES.post.base}${postId}`);
  }

  onCancel(){
    //  TODO: return to prev url, via history object.
    this.loadHomePage();
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
    this.loadPostPage(newPostData.id);
  }

  onSubmit(e){
    e.preventDefault();
    this.onSave();
  }

  render(){

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

    return  (
      <div>

        <small>New Post</small>

            <form
              onSubmit={(e)=> {this.onSubmit(e)}}
              >

                <input
                  component="input"
                  className={this.state.validField.title?"edit-title":"edit-title invalid-field"}
                  type="text"
                  placeholder="Title"
                  value={this.state.title}
                  onChange={ (event) => {this.controlledTitleField(event, event.target.value)} }
                />

              <textarea
                className={this.state.validField.body?"edit-post-body":"edit-post-body invalid-field"}
                type="text"
                placeholder="Write Something"
                value={this.state.body}
                onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
                rows={'5'}
                />

              <input
                className={this.state.validField.author?"edit-author":"edit-author invalid-field"}
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
                className={canSubmit?"on-save":"has-invalid-field"}
                onClick={() => {this.onSave();}}
                disabled={!canSubmit}
                >
                Save
              </button>
              <button
                className="on-cancel"
                onClick={() => {this.onCancel();
              }}>
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
    onSave: (newPostData) => dispatch(addPost(newPostData)),
    fetchCategories:  (postId) => dispatch(fetchCategories(postId)),
  })
}

function mapStoreToProps (store, ownProps) {
  const categoryNames = Object.keys(store.categories).reduce((acc, categoryKey) => {
    return acc.concat([store.categories[categoryKey].name]);
  }, []);

  const history = (ownProps.routerProps && ownProps.routerProps.history )|| null

  return {
    categoriesObject: store.categories,
    categoryNames: categoryNames || null,
    categoryName: categoryNames[0] || HOME.category,

    // so this.props.history.push() still works without refactor
    history,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(NewPost);
