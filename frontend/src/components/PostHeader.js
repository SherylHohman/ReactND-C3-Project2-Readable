import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../state/posts/ducks';
import { changeView } from '../state/viewData/ducks';
import PropTypes from 'prop-types';

const PostHeader = function(props) {
  const post = props.post;

  //  required to display (see project requirements) Ok, don't show id.
  const {id, title, category, voteScore, commentCount} = props.post;
  //  not required; may like to include (on Post, maybe not Home),
  const {author, timestamp} = post;

  return  (
    <div>
      <div key={post.id}>
        <Link to={`/post/${post.id}`} onClick={() => {
          props.onChangeView(`/post/${post.id}`, post.id)
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

};


// can't make required: if url is of synch with data in store, then data==null adn propTypes fail.  Problem is needing to access url from browser bar to get id.
PostHeader.propTypes = {
  post: PropTypes.object//.isRequired,       // if keep as a "dumb" component
  // postId: PropTypes.string.isRequired,    // if turn into a connected comp
}

function mapDispatchToProps(dispatch){
  return ({
    onChangeView: (url, selected) => dispatch(changeView({ url, selected })),
  })
}

function mapStoreToProps ( store, ownProps ) {
  const postId = store.viewData.selected;
  return {
    ...ownProps,
    post: ownProps.post,
    // post: store.posts[postId],
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(PostHeader);

 // export default PostHeader;
