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
    title: '',
    //  TODO: this should be set automatically, once have a 'LoggedInUser'
    author: 'sheryl',  // TODO - s/b input field
    body:  '',
    category: '',
  }

  haveCategories(){

    const val = (this.props &&
             this.props.categories &&
             this.props.categories !== null &&
             Array.isArray(this.props.categories) &&
             this.props.categories.length > 0  &&
             this.props.categories[0].name
             );
    console.log('NewPost: haveCategories, val:', val);

      // val === false, if does not make it to the final check: (name).
      // If (name) exists, then val === (name), ==> return true.
      // If (name) undefined, val is either false or undefined
      //  (either look up which it would be, or just use: !!val to ensure false)

    return (!!val === false) ? false : true;
  }

  componentDidMount(){
    console.log('in NewPost componentDidMount');

    // const haveCategories = this.props &&
    //                        this.props.categories &&
    //                        this.props.post !== null &&
    //                        this.props.post !== []
    //                      ? true
    //                      : false;

    if (!this.haveCategories()){
        this.props.fetchCategories();
        console.log('fetching categories..');
    }
    else {
      // initialize post category to first in the list
      console.log('have categories:', this.props.categories);
      console.log('setting default value to first in the list:', this.props.categories[0]);
      this.setState({category: this.props.categories[0]});
    }
  }

  componentWillReceiveProps(nextProps){
    console.log('EditPost componentWillReceiveProps, nextProps:', nextProps);

    // categories never change in life of app, so always ok to overwrite w/o checking.
    if ( nextProps &&
         nextProps.categories &&
         nextProps.categories &&
         nextProps.categories[0]
       ){
          this.setState({
          // default selected category to the first in the list
          category:   nextProps.categories[0],
       })
      console.log('..setState on new categories:', nextProps.categories);
    }

    // if ( nextProps.categories &&
    //    (!this.props.categories || (this.props.categories !== nextProps.post.categories))){
    //   this.setState({
    //     categories: nextProps.post.categories,
    //     category: nextProps.post.categories[0],
    //   })
    // }
  }

  controlledTitleField(e, currentText){
    this.setState({title: currentText});
  }
  controlledBodyField(e, currentText){
    this.setState({body: currentText});
  }
  controlledCategoryField(selectedCategory){
    this.setState({category: selectedCategory});
  }
  controlledAuthorField(currentText){
    this.setState({author: currentText});
  }
  creatPostId(){
    return Math.random().toString(36).substr(-20);
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

    //  TODO: if can access user history, "Cancelling" could return to prev url.

    // These are the values viewData is initialized with for the home page.
    const selectedItem = this.state.category.name || '';
    const url = '/';

    this.props.onChangeView(url, selectedItem);
    this.props.history.push(url);
  }

  showPost(){

    this.loadHomePage();
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

    // // TODO: put and get history from Store, rather than passed as prop from Route
  }
  onCancel(){
    this.loadHomePage();
  }
  onSave(){

    console.log('onSave, this.state.category', this.state.category);

    const categoryName = this.state.category.name;  // if store only the name on state..
    // can use the name to filter through the array of categories to find the category.

    const newPostData = {
      // id: this.state.id,   // was working, dow does not (neither does category)
      id: this.creatPostId(),
      title: this.state.title,
      // TODO: automatically populate author from logged in user
      author: 'sheryl',        //t TODO: fix - this.state.author,
      body: this.state.body,
      category: this.state.category.name,
      timestamp: Date.now(),

      // TODO: input validation: no empty fields.
    }

    // There are additional fields on a "full" Post object.
    // Hence the name. (they have default values for a new post.)
    this.props.onSave(newPostData);
    console.log('onSave NewPost, newPostData:', newPostData);
    this.showPost();
  }

  renderHaveNoCategoriesMssg(){
    console.log('renderHave_No_CategoriesMssg');
    return (
      <p> Hang on.. we're looking for the categories ! </p>
    )
  }
  renderCategoriesDropDown(){
    // console.log('this.props', this.props);
    // console.log('this.props.categories', this.props.categories);

    // console.log('this.props', this.props);
    // console.log('this.props', this.props);

    console.log('renderCategoriesDropDown:', this.props.categories);

    return (
       <select
        value={this.state.category}
        onChange={(e)=>this.controlledCategoryField(e.target.value)}
        >
        {this.props.categories.map((category) => {
          return (
            <option key={category.name} value={category}>{category.name}</option>
          )
        })}
      </select>
    )
  }
  renderCategoriesSection(){
    if (this.haveCategories()){
      this.renderCategoriesDropDown();
    } else {
      this.renderHaveNoCategoriesMssg();
    }
  }

  render(){

    return  (
      <div>

        <p>New Post</p>

        <form onSubmit={(e)=> {this.onSubmit(e)}}>
          {/* uses state * /}
          <input
            className="edit-author"
            type="text"
            placeholder="Your Name in Lights.."
            value={this.state.author}
            onChange={ (event) => {this.controlledAuthorField(event, event.target.value)} }
            />  */}

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

        {/* uses props */}
        <h4> Rendered Edited Post </h4>
        <h3> {this.state.title} </h3>

        {/* should be this.state.category.name why UNDEFINED ?? */}
        {/*<p>  Category: {this.state.category.name}  </p>*/}
        {console.log('this.props.categories:', this.props.categories || null)}

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

  console.log('mapStoreToProps, categories:', categories);

  return {
    categories: categories || null,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(NewPost);


//   If page is loaded from saved url: Store is empty. Redirect to home page. Instead...
//   TODO: perhaps I can read it from viewData.selected (aka props.postId), or viewData.url
//   TODO: better solution: read post id from the url, then fetch the post.

