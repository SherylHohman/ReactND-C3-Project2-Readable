import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../state/posts/ducks';
import viewData from '../state/viewData/ducks';
import PropTypes from 'prop-types';

const PostHeader = function(props) {
  console.log('PostHeader props:', props);
  const post = props.post;

  //  required to display (see project requirements) Ok, don't show id.
  const {id, title, category, voteScore, commentCount} = props.post;

  //  not required, but may like to include (at least on PostDetails),
  //  (maybe, maybe not on Home Page, listing of all posts)
  const {author, timestamp} = post;

  // if (post.deleted) {
  //   // if user accesses this page through an old URL..
  //   console.log('Can\'t render Postheader of deleted post id:', post.id);
  //   return (
  //     <div><h2>This Post has been Deleted</h2></div>
  //   )
  // };

  // const showPost = function(){
  //   const url = `/post/${post.id}`;
  //   const selected = post.id;
  //   props.dispatch(props.changeView(url, selected))
  // }

  // may want the path to be in this format: `path="/task/?:taskId?"`
  const location = {
            // pathname: `/post/?:${post.id}`,
            // pathname: `/post/${post.id}`,
            // pathname: `/post/id=${post.id}`,
            pathname: `/post/${post.id}`,
            query: {id: post.id},
            state: { post: props.post }
          }

  return  (
    <div>
      <div key={post.id}>
        {/*<Link to={location} >*/}
        <Link to={`/post/${post.id}`} onClick={() => {
          props.changeView(`/post/${post.id}`, post.id)
        }}>
          <h2>{title}</h2>
        </Link>

        <div>votes: {voteScore} increment decrement</div>
        <p>{category}</p>
        <div>number of comments: {commentCount}</div>
        <hr />
      </div>
    </div>
  )


    // return  (
  //   <div>
  //     <div key={post.id}>

  //       <Link to={`/post/${post.id}/`} >
  //         <h2>{title}</h2>
  //       </Link>

  //       <div>votes: {voteScore} increment decrement</div>
  //       <p>{category}</p>
  //       <div>number of comments: {commentCount}</div>
  //       <hr />
  //     </div>
  //   </div>
  // )


  // return  (
  //   <div>
  //     <div key={post.id}>

  //       <Link to={`/post/${post.id}/`} >
  //         <h2>{title}</h2>
  //       </Link>

  //       <div>votes: {voteScore} increment decrement</div>
  //       <p>{category}</p>
  //       <div>number of comments: {commentCount}</div>
  //       <hr />
  //     </div>
  //   </div>
  // )

};

{/*PostHeader.propTypes = {
  post: PropTypes.object.isRequired,       // if keep as a "dumb" component
  // postId: PropTypes.string.isRequired,  // if turn into a connected comp
}

*/}


// -----------------------
// export class PostHeader extends Component {

//   render(){

//   }
// }

// -----------------------

function mapDispatchToProps(dispatch){
  console.log("in PostHeader mapDispatchToProps");
  return ({
    changeView: (url, selected) => dispatch(viewData(url, selected))
  })
}

function mapStoreToProps ( store, ownProps ) {
  console.log('PostHeader, mapStoreToProps, ownProps', ownProps);
  console.log('PostHeader, mapStoreToProps, store', store);
  const postId = store.viewData.selected;
  return {
    ...ownProps,
    post: ownProps.post,
    // post: store.posts[postId],
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(PostHeader);

 // export default PostHeader;
