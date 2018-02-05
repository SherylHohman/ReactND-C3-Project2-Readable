import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addPost } from '../store/posts';
import { changeView } from '../store/viewData';
import { fetchCategories } from '../store/categories';
import PropTypes from 'prop-types';


export class NewPost extends Component {

  state = {
    title: '',
    author: '',   //  TODO: assign the value of 'LoggedInUser'
    body:  '',
    categoryName: '',
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

      // val === false, if does not make it to the final check: (name).
      // If (name) exists, then val === (name), ==> return true.
      // If (name) undefined, val is either false or undefined
      //  (either look up which it would be, or just use: !!val to ensure false)
  }

  componentDidMount(){
    console.log('in NewPost componentDidMount');

    if (!this.haveCategories()){
        this.props.fetchCategories();
        console.log('fetching categories..');
    }
    else {
      // initialize post category to first in the list
      this.setState({categoryName: this.props.categories[0].name});
    }
  }

  componentWillReceiveProps(nextProps){
    // console.log('EditPost componentWillReceiveProps, nextProps:', nextProps);
    // categories never change in life of app, so always ok to overwrite w/o checking.
    if ( nextProps &&
         nextProps.categories &&
         nextProps.categories &&
         nextProps.categories[0]
       ){
          // default "selected" category to the first in the list
          this.setState({
          categoryName:   nextProps.categories[0].name,
       })
      console.log('..setState on new categories:', nextProps.categories);
    }
  }

  controlledTitleField(e, currentText){
    this.setState({title: currentText});
  }
  controlledBodyField(e, currentText){
    this.setState({body: currentText});
  }
  controlledCategoryField(selectedCategoryName){
    this.setState({categoryName: selectedCategoryName});
  }
  controlledAuthorField(e, currentText){
    this.setState({author: currentText});
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
    // These are the values viewData is initialized with for the home page.
    const selected = '';
    const url = '/';
    this.props.onChangeView(url, selected);
    this.props.history.push(url);
  }

  loadCategoryPage(){
    const categoryName = this.state.categoryName;
    console.log('categories', this.props.categories);
    const category = this.props.categories.find((category) => {
      return category.name === categoryName;
    });
    console.log('categoryName, path', categoryName, category.path);

    const selectedCategory = this.state.categoryName || '';
    const url = `/category/${category.path}` || '/';
    console.log('selectedCategory & url:', selectedCategory, url);

    this.props.onChangeView(url, selectedCategory);
    // TODO: set sortOrder to load most recent at top of page

    this.props.history.push(url);
  }

  showPost(){
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

  onSave(){
    const newPostData = {
      id:    this.creatPostId(),
      title: this.state.title,
      body:  this.state.body,

      // TODO: automatically populate author from logged in user
      author:    this.state.author,
      category:  this.state.categoryName,
      timestamp: Date.now(),
    // "Full" Post object has additional fields, initialized by the server.
    }

    // TODO: input validation: no empty fields.
    this.props.onSave(newPostData);

    // TODO: this.showPost();
    this.loadCategoryPage();
  }

  render(){

    const loadingCategories = (
        <p> Hang on.. we're looking for the categories ! </p>
    )

    const selectCategory = (
        <div>
           <select
            value={this.state.categoryName}
            onChange={(e)=>this.controlledCategoryField(e.target.value)}
            >
            {this.props.categories.map((category) => {
              return (
                <option key={category.name} value={category.name}>{category.name}</option>
              )
            })}
          </select>
        </div>
    );
                                    //this.haveCategories()
    const selectCategoryOrLoading = (this.state.categoryName !== '')
         ? selectCategory
         : loadingCategories;

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

          <input
            className="edit-post-body"
            type="text"
            placeholder="Write Something Amazing.."
            value={this.state.body}
            onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
            />

          <input
            className="edit-author"
            type="text"
            placeholder="Your Name in Lights.."
            value={this.state.author}
            onChange={ (event) => {this.controlledAuthorField(event, event.target.value)} }
            />

            <div>
                {selectCategoryOrLoading}
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
        <h4> Rendered Edited Post </h4>
        <h3> {this.state.title} </h3>

        <p>  Category: {this.state.categoryName}  </p>

        <p>  {this.state.body}  </p>
        <p>  Authored by: {this.state.author}  </p>
        <p>  {this.state.id}  </p>
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
    onChangeView: (url, selected) => dispatch(changeView({ url, selected })),
    fetchCategories:  (postId) => dispatch(fetchCategories(postId)),
  })
}

function mapStoreToProps ( store ) {
  const categories = Object.keys(store.categories).reduce((acc, categoryKey) => {
    return acc.concat([store.categories[categoryKey]]);
  }, []);

  return {
    categories: categories || null,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(NewPost);
