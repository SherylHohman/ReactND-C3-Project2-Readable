import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { changeView } from '../state/viewData/ducks';
import PropTypes from 'prop-types';

const PostHeader = function(props) {
  const post = props.post;

  const { id } = post;
  //  required to display (see project requirements)
  const {title, category, voteScore, commentCount} = props.post;
  //  not required; may like to include (on Post, maybe not Home),
  const {author, timestamp} = post;

  return  (
    <div>
      <div key={id}>
        <Link to={`/post/${id}`} onClick={() => {
          props.onChangeView(`/post/${id}`, id)
        }}>
          <h2>{title}</h2>
        </Link>

        <div><button>increment</button> | votes: {voteScore} | <button>decrement</button></div>
        <p>{category} | {author} | {timestamp}</p>
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
    // ...ownProps,
    // post: ownProps.post,
    post: store.posts[postId],
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(PostHeader);

 // export default PostHeader;
