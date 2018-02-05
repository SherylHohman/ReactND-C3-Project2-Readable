import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Redirect, Link } from 'react-router-dom';
import { addPost } from '../store/posts';
import { changeView } from '../store/viewData';
import { fetchCategories } from '../store/categories';
import PropTypes from 'prop-types';


export class NewPost extends Component {

  state = {
    id: Math.random().toString(36).substr(22),
    title: 'You\'re Awesome !',
    //  TODO: this should be set automatically, once have a 'LoggedInUser'
    author: 'SH',  // TODO - s/b input field
    body:  'Remember this:)  It does noone any good to think otherwise.  Least of all you.  Remember this, too.  Everyone is awesome. Feel Happy any way you can.  Intrinsic happiness is fuller than a temporary surface pleasure.  Though pleasure can help you find your way from unhappiness back to where you, and everyone, should strive to live at all times.',
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

      // val === false, if does not make it to the final check: (name).
      // If (name) exists, then val === (name), ==> return true.
      // If (name) undefined, val is either false or undefined
      //  (either look up which it would be, or just use: !!val to ensure false)

    return (!!val === false) ? false : true;
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
          this.setState({
          // default selected category to the first in the list
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
    // Base-36 gives 10 digits plus 26 alphabet characters (lower case)
    //   Start at index 2 to skip the leading zero and decimal point
    //   Use 20 characters
    //   Perhaps not necessary to add; might limit the possibility of getting 0.
    return  Math.random().toString(36).substring(2, 20)
            + Math.random().toString(36).substring(2, 20);
  }
  onSubmit(e){
    e.preventDefault();
    this.onSave();
    return false;
  }

  loadHomePage(){
    // If user Cancels, goto home page.
    //  Also if an error loading page from a saved url.
    //  Or if have trouble fetching categories

    // These are the values viewData is initialized with for the home page.
    const selected = '';
    const url = '/';

    this.props.onChangeView(url, selected);
    this.props.history.push(url);
  }

  loadCategoryPage(){
    const category = this.props.categories.find((category) => {
      return category.name === this.state.categoryName;
    });

    const selectedCategory = this.state.categoryName || '';
    const url = category.url || '/';

    this.props.onChangeView(url, selectedCategory);
    this.props.history.push(url);
  }

  showPost(){
    // Can't re-direct to thePost just yet,
    // So, re-direct to the Category page (rather than home).
    this.loadCategoryPage();

    // TODO: default to filter on the category from this post ?
      // TODO: Stay Here, show spinner, util it' saved in store,
      //       then redirect to the post page.

      // // goto the post when user Submits/Saves the Post
        // const postId = this.state.id;
        // const postUrl = `/post/${postId}`;

        // this.props.onChangeView(postUrl, postId);

        // // Actuallyl, I cannot show the new page until after it's saved in the DB
        // //  This would need to be a response to ADD_POST_SUCCESS action type.
        // // this.props.history.push(postUrl);

        // // Go to home page, sorting the posts by most recent.
        // // Then from there, the new post should appear on store, then re-render.

      // // TODO: stay here with a spinner, until ADD_POST_ACTION
      // //  that redirects to the new post.

      // // FOr now, just go to home.
  }

  onCancel(){
    //  TODO: if can access user history, "Cancelling" could return to prev url.
    this.loadHomePage();
  }

  onSave(){
    console.log('onSave, this.state.categoryName', this.state.categoryName);

    const categoryName = this.state.categoryName;

    const newPostData = {
      id: this.creatPostId(),
      title: this.state.title,
      // TODO: automatically populate author from logged in user
      author: 'sheryl',
      body: this.state.body,
      category: this.state.categoryName,
      timestamp: Date.now(),
    }
    // "Full" Post object has additional fields, initialized by the server.

    // TODO: input validation: no empty fields.
    this.props.onSave(newPostData);
    this.showPost();
  }

  renderHaveNoCategoriesMssg(){
    console.log('___renderHave_No_CategoriesMssg');
    return (
      <p> Hang on.. we're looking for the categories ! </p>
    )
  }

  renderCategoriesDropDown(){
    console.log('___rendering CategoriesDropDown:', this.props.categories);
    console.log('___rendering first item is:', this.props.categories[0].name);
    return (
      <div>
        <h2> HELLO </h2>
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
  }

  renderCategoriesSection(){
    console.log('__render categories decision time..');
    if (this.haveCategories()){
      this.renderCategoriesDropDown();
    } else {
      this.renderHaveNoCategoriesMssg();
    }
  }

  render(){

    return  (
      <div>

        <small>New Post</small>

        <form onSubmit={(e)=> {this.onSubmit(e)}}>

          {/* uses state */}
          <input
            className="edit-author"
            type="text"
            placeholder="Your Name in Lights.."
            value={this.state.author}
            onChange={ (event) => {this.controlledAuthorField(event, event.target.value)} }
            />

          <input
            className="edit-title"
            type="text"
            placeholder="Clever Title.."
            value={this.state.title}
            onChange={ (event) => {this.controlledTitleField(event, event.target.value)} }
            />

            <div>
                {this.renderCategoriesSection()}
            </div>

          <input
            className="edit-post-body"
            type="text"
            placeholder="Write Something Amazing.."
            value={this.state.body}
            onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
            />
          <button
            className=""
            onClick={() => {this.onSave();}}
            >
            Save
          </button>
          <button
            className=""
            onClick={() => {this.onCancel();
          }}>
            Cancel
          </button>
        </form>

        <hr />

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

  // console.log('mapStoreToProps, categories:', categories);

  return {
    categories: categories || null,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(NewPost);


//   If page is loaded from saved url: Store is empty. Redirect to home page. Instead...
//   TODO: perhaps I can read it from viewData.selected (aka props.postId), or viewData.url
//   TODO: better solution: read post id from the url, then fetch the post.

