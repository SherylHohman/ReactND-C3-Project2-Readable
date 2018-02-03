import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { editPost } from '../state/posts/ducks';
import { changeView } from '../state/viewData/ducks';
import { fetchPost } from '../state/posts/ducks';
import { fetchPosts } from '../state/posts/ducks';  // temp since fetchPost isn't working
import PropTypes from 'prop-types';


export class EditPost extends Component {

  state = {
    title: '',
    body:  '',
    category: '',
  }

  componentDidMount(){
    console.log('in EditPost componentDidMount');

    let havePost = true;
    let havePostId = true;
    let postId;

    if (!this.props || !this.props.post ||
         this.props.post === null ||
         this.props.post === {} ||
         !this.props.post.id) {
      console.log('..componentDidMount, EditPost: props has no post');
      havePost = false;

      // TODO: DELETE _ TEMP FOR TESTING FETCH/RE_RENDER WHEN Have PostId, but no Post
      postId = '8xf0y6ziyjabvozdd253nd';  // temp for testing  // temp for testing
      this.props.onChangeView(`/post/${postId}/edit`, postId); // temp for testing
      havePostId = true;  // temp for testing
      console.log('..falsely setting a postId, to test fetching a post from EditPost ' +
                  '(ie later may be able to recover the postId from the url, and get it that way)');
    }
    else {
      postId = this.props.postId;
      havePostId = true;  //redundant cuz move things around in debugging //temp for testing
    }

    //  The length used is a "magic number" that could change causing a bug.
    //  length is a hacky "type-checker" for determining if the "selected" value from store,
    //    represents a category, rather than a postId or commentId
    //    CURRENTLY, id's are about 22 digits, but this could change, causing
    //    bugs in any code relying on this.
    //    So this hack is easily broken, and easily fooled. Best to not use it.
    //  Oh - postId is set in mapStateToProps from store.viewData.selected !
    if (postId === '' || postId === null || postId.length<16){
      havePostId = false;
    }

    if (!havePostId && !havePost){
      console.log('EditPost CDM, no postId, no post, ..returning home')
      this.loadHomePage();
    }

    // TODO: WHY?? does page not reload after fetchPosts puts posts on store ??
    if (havePostId && !havePost){
        // console.log('__fetching all posts');
        // this.props.fetchPosts();
        console.log('__fetching post, postId', postId);
        this.props.fetchPost(postId)
    }

    if (havePost) {
      // controlled input fields
      console.log('havePost, props:', this.props, 'state before', this.state);
      this.setState({
        // TODO: WHY?? does setState not Update info once have fetched the posts ??
        title: this.props.post.title,
        body : this.props.post.body,
        category: this.props.post.category,
      });
      console.log('state after', this.state);
    }

    //Thought: put counter on state, initialized at 1.
    //  when CDM is called increment it.
    //  CDM will be called before rendering.
    //  if have data, np. everything works
    //  if don't have post, then I call fetch post,
    //    then once post has been fetched, CDM (is supposed to be called again,
    //    since state has changed.  Since its "connected" a change in store should
    //    trigger a change in props. Hence we're here, try 2)
    //  So, uncessful at post on try 2 -> reload the post page instead.
    //    easy to click "edit" from there.
    //  Of course, if CDM never gets called, despite prop change
    //    (the issue I have currently) ,then.. Oops - no go.
    //  Could also start a timer.  If 30sec passes, and still no post, then
    //    trigger a page load.
    //  Could also try in 2 phases: first try loading the single post
    //    if that doesn't work, then load all posts, and filter to find this one.
    //  Then if have postId, reload Post page, and if don't, then reload home.
    //  Ok, part of that didn't make logical sense. Just ignore that bit.
  }

  componentWillReceiveProps(nextProps){
    console.log('__componentWillReceiveProps, nextProps', nextProps);
  }

  controlledTitleField(e, currentText){
    // prevent default ?
    this.setState({title: currentText});
  }

  controlledBodyField(e, currentText){
    // prevent default ?
    this.setState({body: currentText});
  }

  loadHomePage(){
    // used when cannot get the post, (not in store/props, could not fetch/nopostId)

    // probably should be null, but '' is it's initial state for home when app loads
    const postId = '';
    const postUrl = '/';

    this.props.onChangeView(postUrl, postId);
    this.props.history.push(postUrl);
  }

  returnToPost(){
    const postId = this.props.postId;
    const postUrl = `/post/${postId}`;

    this.props.onChangeView(postUrl, postId);
    // TODO: put and get history from Store, rather than passed as prop from Route
    this.props.history.push(postUrl);
  }
  onCancel(){
    this.returnToPost();
  }
  onSave(){
    //  sending only changed values, rather than the whole post
    //  If decide instead to send the entire post, rename the object to "post"
    const editedPostData = {
      title: this.state.title,
      category: this.state.category,
      body: this.state.body,
    }

    this.props.onSave(this.props.postId, editedPostData);
    this.returnToPost();
  }

  render(){

    //   If page is loaded from saved url: Store is empty. Redirect to home page.
    //   TODO: better solution: read post id from the url, then fetch the post.
    //   TODO: even before I reading postId from the url,
    //    perhaps I can read it from viewData.selected (aka props.postId), or viewData.url


    // if ((!this.props || !this.props.post || this.props.post === null) ||
    //    (this.state.title === '' && this.state.body === '' && this.state.category === '')) {
    //   console.log('Post: post wasn\'t present in props, hopefully, will attempt to fetch it');

    // if (this.props.postId === '' || this.props.postId === null){
    //   return (
    //     <div>
    //       <p>I do not know that post id.. Can you find it for me ?</p>
    //       <p> ..going to the home page now ;-)</p>
    //       <Redirect to="/" />
    //     </div>
    //   )
    // }

    //   let tempData = this.props || this.props.post || this.props.post || this.state.title+this.state.body+this.state.category;
    //   console.log('either props, or state - whatever first data I have, tempData:', tempData);


    const postId = this.props.postId;
    const postUrl = `/post/${postId}`;
    console.log('about to render state:', this.state);

    // if (this.state.title === '' && this.state.body === '' && this.state.category === ''){
      if (!this.props || !this.props.post || !this.props.post.id){
      return (
        <div><h2> Hold On.. I'm getting your Post </h2></div>
      )
    }

    return  (
      <div>
        <form>
          {/* uses state */}
          <input
            className="edit-title"
            type="text"
            value={this.state.title}
            onChange={ (event) => {this.controlledTitleField(event, event.target.value)} }
            />
          {/*category - should be drop down list of avail categories
          <input
            className="edit-post-category"
            type="text"
            value={this.state.body}
            onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
            />
            */}
          <input
            className="edit-post-body"
            type="text"
            value={this.state.body}
            onChange={ (event) => {this.controlledBodyField(event, event.target.value)} }
            />
          <Link
            to={postUrl}
            onClick={() => {this.onSave();}}
            >
            <button>Save</button>
          </Link>
          <Link
            to={postUrl}
            onClick={() => {this.onCancel();
            }}>
            <button>Cancel</button>
          </Link>
          <hr />
          {/* uses props (immutable) */}
          {/* TODO: css to make orig in light gray and smaller. Make above larger*/}
          <h3> Original Post </h3>
          <h2> {this.props.title} </h2>
          <p>  {this.props.category}  </p>
          <p>  {this.props.body}  </p>
        </form>
      </div>
    )
  };

}

EditPost.propTypes = {
    // TODO: how to make required, when using redux.store
    // TODO: how to require specific keys exist on an (required) object
    postId: PropTypes.string,
    post : PropTypes.object,    // required keys: title, body, category
    history: PropTypes.object,
}

function mapDispatchToProps(dispatch){
  return ({
    onSave: (postId, editedPostData) => dispatch(editPost(postId, editedPostData)),
    onChangeView: (url, selected) => dispatch(changeView({ url, selected })),
    fetchPost:  (postId) => dispatch(fetchPost(postId)),
    fetchPosts: (postId) => dispatch(fetchPosts()),
  })
}

function mapStoreToProps ( store ) {
  const postId = store.viewData.selected;
  // try copying post to create a NEW object -- maybe that will allow page to re-render?
  const copyOfPost = {...store.posts[postId]};
  return {
    postId: store.viewData.selected || null,
    // post: store.posts[postId] || null,
    post: copyOfPost || null,
    posts: store.posts || null,   // 4testing - perhaps  non re-render is an imutable problem ?
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(EditPost);
