import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../state/posts/ducks';
import { Route } from 'react-router-dom';  // TODO: DELETE - TEMP for
import PostDetail from './PostDetail';  // TODO: DELETE - TEMP for debugging.
import PropTypes from 'prop-types';


const PostHeader = function(props) {
  const post = props.post;

  //  required to display (see project requirements) Ok, don't show id.
  const {title, category, voteScore, commentCount} = post;

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

  // may want the path to be in this format: `path="/task/?:taskId?"`
  const location = {
            pathname: `/post/?:${post.id}`,
            query: {id: post.id},
            state: { post: props.post }
          }

  // const location = {
  //           pathname: '/post',
  //           query: {id: post.id},
  //           state: { post: props.post }
  //         }
  // https://github.com/ReactTraining/react-router/issues/4036

  // const location = {
  //           pathname: `/post/${post.id}/`,
  //           state: { post: props.post }
  //         }

  // return  (
  //       /*temp insert PostDetail component directly*/
  //       <div>
  //         <PostDetail post={post} />
  //       </div>
  //       /*end temp insert PostDetail component directly*/
  // )

  // return  (
  //       /*temp insert PostDetail component directly*/
  //       <div>
  //         <h2>{title}</h2>
  //         <PostDetail post={post} />
  //       </div>
  //       /*end temp insert PostDetail component directly*/
  // )


  return  (
    <div>
      <div key={post.id}>

        <Link to={location} >
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


// export class PostHeader extends Component {

//   render(){

//   }
// }

// function mapDispatchToProps(dispatch){
//   return ({

//   })
// }

// function mapStoreToProps ( store, ownProps ) {
//   return {
//     post: ownProps.postId,
//   }
// };

// export default connect(mapStoreToProps, mapDispatchToProps)(PostHeader);

 export default PostHeader;
