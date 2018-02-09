import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addPost } from '../store/posts';
import { changeView, HOME } from '../store/viewData';
import { fetchCategories } from '../store/categories';
import PropTypes from 'prop-types';


export class NewPost extends Component {

  state = {
    title:  '',
    author: '',   //  TODO: assign the value of 'LoggedInUser'
    body:   '',
    categoryName: HOME.category.name,
  }

  haveCategories(){

    const val = (this.props &&
             this.props.categories &&
             this.props.categories !== null &&
             Array.isArray(this.props.categories) &&
             this.props.categories.length > 0  &&
             this.props.categories[0].name
             );

    return (!!val === false) ? false : true;

      // val === false, unless it makes it to the final check: (name).
      // In that case, val === (name).
      // If (name === '', null, or undefined), val will be falsey,
      //   so ternary will resolve to false.
      // Hence, haveCategories returns true ONLY if First Element has a valid name.
      // Could just write (val) ? false : true, but this is slightly more explicit.
  }

  componentDidMount(){
    console.log('in NewPost componentDidMount');

    if (!this.haveCategories()){
        this.props.fetchCategories();
        console.log('fetching categories..');
    }
    else {
      // initialize a default category to first in the list
      this.setState({categoryName: this.props.categories[0].name});
    }
  }

  componentWillReceiveProps(nextProps){
    // console.log('EditPost componentWillReceiveProps, nextProps:', nextProps);
    // categories never change in life of app, so always ok to overwrite w/o checking.
    if ( nextProps &&
         nextProps.categoryNames &&
         Array.isArray(nextProps.categoryNames) &&
         nextProps.categoryNames[0]
       ){
          // default init "selected" category to the first in the list
          this.setState({
            categoryName: nextProps.categoryNames[0],
          })
      }
  }

  controlledTitleField(e, currentText){
    e.preventDefault();
    this.setState({title: currentText});
    return false;
  }
  controlledBodyField(e, currentText){
    e.preventDefault();
    this.setState({body: currentText});
    return false;
  }
  controlledCategoryField(e, selected){
    this.setState({categoryName: selected});
  }
  controlledAuthorField(e, currentText){
    e.preventDefault();
    this.setState({author: currentText});
    return false;
  }
  creatPostId(){
    return  Math.random().toString(36).substring(2, 20)
          + Math.random().toString(36).substring(2, 20);
    // Base-36 gives 10 digits plus 26 alphabet characters (lower case)
    //   Start at index 2 to skip the leading zero and decimal point
    //   Use 20 characters
    //   Perhaps not necessary to add; might limit the possibility of getting 0.
  }

  onSubmit(e){
    e.preventDefault();
    this.onSave();
    return false;
  }

  loadHomePage(){
    const id  = HOME.id;
    const url = HOME.url;
    this.props.changeViewByUrlId(url, id);
    this.props.history.push(url);
  }

  loadCategoryPage(categoryName){
    // console.log('__loadCategoryPage, this.state:', this.state)
    const category = this.props.categoriesObject[categoryName] || HOME.category;

    this.props.changeViewByCategory(category);
    // TODO: set persistentSortBy to 'date', sortOrder to 'descending'
    // this.props.changeSortBy('date');

    const url = `/category/${category.path}` || HOME.url;
    this.props.history.push(url);
  }

  loadPostPage(){
    // TODO: Implementation
    // TODO: Stay Here, Show spinner until ADD_POST_SUCCES (post is saved in store.)

    const postId = this.state.id;
    const postUrl = `/post/${postId}`;

    this.props.onChangeView(postUrl, postId);
    this.props.history.push(postUrl);
  }

  onCancel(){
    //  TODO: return to prev url, via history object.
    this.loadHomePage();
  }

  const newPostDefaults =  {
      id:     this.creatPostId(),
      title:  '(untitled)',
      body:   '(blank)',
      author: '(anonymous)',
        // TODO: automatically populate author from logged in user

      category:  this.props.categoryNames[0] || HOME.category.name,
        // this.props.categoryNames[0] - valid, but inaccurate value
        // HOME.category.name - if could not load categories..
        // ..is likely to cause an error elsewhere, as it cannot be found in
        // "categories", but might otherwise render, unlike null.
  }

  onSave(){
    const categoryName = this.state.categoryName;

    // "Full" Post object has additional fields, initialized by the server.
    const newPostData = {
      id:     this.creatPostId(),
      title:  this.state.title  || '(untitled)',
      body:   this.state.body   || '(blank)',
      // TODO: automatically populate author from logged in user
      author: this.state.author || '(anonymous)',
      category:  categoryName   || newPostDefaults.categoryName,
      timestamp: Date.now(),
    }
    // TODO: this.loadPost(), instead of loadCategory
    this.loadCategoryPage(categoryName);

    // TODO: input validation: no empty fields.
    this.props.onSave(newPostData);
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
                <option key={categoryName} value={categoryName}>{categoryName}</option>
              )
            })}
          </select>
        </div>
    );

    const showCategoriesOrLoading = (this.state.categoryName !== HOME.category.name)
         ? renderSelectCategory
         : renderCategoriesLoading;

    return  (
      <div>

        <small>New Post</small>

        <form onSubmit={(e)=> {this.onSubmit(e)}}>

          {/* uses state */}
          <input
            className="edit-title"
            type="text"
            placeholder="Clever Title.."
            value={this.state.title}
            onChange={ (event) => {this.controlledTitleField(event, event.target.value)} }
            />
          {/* TODO: titleCase on keystrokes */}

          <textarea
            className="edit-post-body"
            type="text"
            placeholder="Write Something Amazing.."
            value={this.state.body}
            onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
            style={{width:'100%'}}
            rows={'5'}
            />

          <input
            className="edit-author"
            type="text"
            placeholder="Your Name in Lights.."
            value={this.state.author}
            onChange={ (event) => {this.controlledAuthorField(event, event.target.value)} }
            {/* TODO: add user field on Home/Page, that auto populates author field */}
            />

            <div>
                {showCategoriesOrLoading}
            </div>

          <button
            className="on-save"
            onClick={() => {this.onSave();}}
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
          <p>  Category: {this.state.categoryName}  </p>
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
    changeViewByUrlId: (url, id) => dispatch(changeView({ currentUrl:url, currentId:id })),
    changeViewByCategory: (category) => dispatch(changeView({ persistentCategory:category })),
    fetchCategories:  (postId) => dispatch(fetchCategories(postId)),
  })
}

function mapStoreToProps ( store ) {
  const categoryNames = Object.keys(store.categories).reduce((acc, categoryKey) => {
    return acc.concat([store.categories[categoryKey].name]);
  }, []);

  return {
    categoriesObject: store.categories,
    categoryNames: categoryNames || null,
    categoryName: categoryNames[0] || HOME.category,

  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(NewPost);
