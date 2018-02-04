import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Redirect, Link } from 'react-router-dom';
import { addPost } from '../store/posts';
import { changeView } from '../store/viewData';
import { fetchCategories } from '../store/categories';
import PropTypes from 'prop-types';


export class NewPost extends Component {
  // TODO: calculate these at onSubmit
  // id,
  // timestamp,

  state = {
    title: '',
    body:  '',
    category: '',

    //  TODO: this should be set automatically, once have a 'LoggedInUser'
    author: '',

    // ok to have here? it shouldn't change - need to be a component constant ?
    id: Math.random().toString(36).substr(-22),
  }

  haveCategories(){
    return !!(this.props &&
             this.props.categories &&
             this.props.categories !== null &&
             Array.isArray(this.props.categories) &&
             this.props.categories !== []
             );
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
        this.props.fetchCategories()
    }
  }

  // componentWillReceiveProps(nextProps){
  //   if (this.props.categories !== nextProps.post.categories){
  //     this.setState({
  //       categories: nextProps.post.categories,
  //     })
  //   }
  // }

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
    return Math.random().toString(36).substr(-8);
  }
  onSubmit(e){
    e.preventDefault();
  }

  loadHomePage(){
    // If user Cancels, goto home page.
    //  Also if an error loading page from a saved url.
    //  Or if have trouble fetching categories

    //  TODO: if can access user history, "Cancelling" could return to prev url.

    // These are the values viewData is initialized with for the home page.
    const selectedItem = this.state.category || '';
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
    const editedPostData = {
      id: this.state.id,
      title: this.state.title,
      author: this.state.author,  // TODO: automatically populate from logged in user
      category: this.state.category,
      body: this.state.body,
      timestamp: Date.now(),

      // TODO: input validation: no empty fields.
    }

    // There are additional fields on a "full" Post object.
    // Hence the name. (they have default values for a new post.)
    this.props.onSave(this.props.postId, editedPostData);
    console.log('onSave NewPost, editedPostData:', editedPostData);
    this.showPost();
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
              {this.haveCategories && (
                <select
                  value={this.state.category}
                  onChange={(e)=>this.controlledCategoryField(e.target.value)}
                  >
                  {this.props.categories.map((category) => {
                    return (
                      <option key={category} value={category}>{category}</option>
                    )
                  })}
                </select>
              )}

              {!this.haveCategories && (
                <p> Hang on.. we're looking for the categories ! </p>
              )}
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
        <p>  Category: {this.state.category}  </p>
        <p>  {this.state.body}  </p>
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
    onSave: (postId, editedPostData) => dispatch(addPost(postId, editedPostData)),
    onChangeView: (url, selected) => dispatch(changeView({ url, selected })),
    fetchCategories:  (postId) => dispatch(fetchCategories(postId)),
  })
}

function mapStoreToProps ( store ) {
  const categoryNames = Object.keys(store.categories).reduce((acc, categoryKey) => {
    return acc.concat([store.categories[categoryKey].name]);
  }, []);

  return {
    categories: categoryNames || null,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(NewPost);


//   If page is loaded from saved url: Store is empty. Redirect to home page. Instead...
//   TODO: perhaps I can read it from viewData.selected (aka props.postId), or viewData.url
//   TODO: better solution: read post id from the url, then fetch the post.

