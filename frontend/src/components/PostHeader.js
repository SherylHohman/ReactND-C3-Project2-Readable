import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { voteOnPost } from '../state/posts/ducks';
// import { upVote, downVote } from '../utils/api'
// import {upVotePost, downVotePost} from '../state/posts/ducks';
// import {incrementVoteOnComment, decrementVoteOnComment} from '../state/comments';
import { changeView } from '../state/viewData/ducks';
import PropTypes from 'prop-types';

const PostHeader = function(props) {
  const post = props.post;
  const postId = props.post.id;

  //  required to display (see project requirements)
  const {title, category, voteScore, commentCount} = props.post;
  //  not required; may like to include (on Post, maybe not Home),
  const {author, timestamp} = post;

  const d = new Date(timestamp);
  const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const publishedDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

  return  (
    <div>
      <div key={postId}>
        <Link
          to={`/post/${postId}`}
          onClick={() => {props.onChangeView(`/post/${postId}`, postId)
        }}>
          <h2>{title}</h2>
        </Link>

        <div>
          <button onClick={() => {props.postVote(postId, 'upVote')}}>increment</button>
          | votes: {voteScore} |
          <button onClick={() => {props.postVote(postId, 'downVote')}}>decrement</button>
        </div>
        <p>Category: {category} | By: {author} | On: {publishedDate}</p>
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
  console.log('in PostHeader, mapDispatchToProps');
  // console.log('upVote, downVote', upVote, downVote);
  return ({
    postVote: (postId, voteString) => dispatch(voteOnPost(postId, voteString)),
    // postUpVote:   (postId) => dispatch(voteOnPost(postId, upVote)),
    // postDownVote: (postId) => dispatch(voteOnPost(postId, downVote)),
    onChangeView: (url, selected) => dispatch(changeView({ url, selected })),
  })
}

function mapStoreToProps ( store, ownProps ) {
  const postId = store.viewData.selected;
  return {
    // ...ownProps,
    // post: ownProps.post,
    post: store.posts[postId],
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(PostHeader);

 // export default PostHeader;
