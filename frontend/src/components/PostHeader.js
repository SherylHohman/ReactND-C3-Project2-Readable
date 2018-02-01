import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { changeView } from '../state/viewData/ducks';
import {upVotePost, downVotePost} from '../state/posts/ducks';
import { dateMonthYear } from '../utils/helpers';
import PropTypes from 'prop-types';

const PostHeader = function(props) {
  const post = props.post;
  const postId = props.post.id;

  //  required to display (see project requirements)
  const {title, category, voteScore, commentCount} = props.post;
  //  not required; may like to include (on Post, maybe not Home),
  const {author, timestamp} = post;

  return  (
    <div>
      <div key={postId}>
        <Link
          to={`/post/${postId}`}
          onClick={() => {props.onChangeView(`/post/${postId}`, postId)
        }}>
          <h2>{title}</h2>
        </Link>

        <div className="vote">
          <div
            className="post-up-vote"
            onClick={() => {props.onUpVotePost(postId)}}>
          </div>
          <h2>{voteScore}</h2>
          <div
            className="post-down-vote"
            onClick={() => {props.onDownVotePost(postId)}}>
          </div>
        </div>

        <p>Category: {category} | By: {author} | On: {dateMonthYear(timestamp)}</p>
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
  // console.log('in PostHeader, mapDispatchToProps');
  return ({
    onChangeView: (url, selected) => dispatch(changeView({ url, selected })),
    onUpVotePost:   (postId) => dispatch(upVotePost(postId)),
    onDownVotePost: (postId) => dispatch(downVotePost(postId)),
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
