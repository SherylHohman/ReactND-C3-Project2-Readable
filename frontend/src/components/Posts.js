import React, { Component } from 'react';
import { connect } from 'react-redux';
// TODO: (fetcjPosts below)
//  `reducers.js` is improperly named.
//  I'm actually importing an action creator, normally in an actions file.
//  I have a quasi duck file, that should be named 'ducks' or 'actionsReducers',
//  or segregated into actions and reducers files.
import { fetchPosts } from '../state/posts/reducers';
// import { fetchPosts } from '../utils/api';

export class Posts extends Component {

  componentWillMount() {
    console.log("in Posts componentWillMount");

  // https://redux.js.org/docs/api/bindActionCreators.html
  // ??
  // let { dispatch } = this.props;
  // let action =


    // ??
    // const { getPosts } = this.props;

    // this.props.getPosts();

    // fetchPosts().then((postsArray) => {
    //   // console.log('cDM posts fetched as objects:', posts);
    //   // // return posts;
    //   // // console.log('posts as array;', posts);

    //   // // this.setState({ posts });

    //   console.log('cDM|fetchPosts: postsArray as array of objects, where EACH POST has extraneous getRequest properties: ', postsArray)
    //   const posts = postsArray.reduce((acc, arrItem) => {
    //     const { id, title, body, category, timestamp,
    //       commentCount, deleted, voteScore } = arrItem;
    //     return ({
    //       ...acc,
    //        [id]: {
    //          id,
    //          title,
    //          body,
    //          category,
    //          timestamp,
    //          commentCount,
    //          deleted,
    //          voteScore,
    //        }
    //     }
    //   )}, {});
    //   this.setState({ posts });

      // console.log('cDM, leaving fetchPosts:', posts);
    // });

    console.log('Posts cDM, leaving:', `${this.state||this.props||'no state or props'}`);

    // });

  }

  // state: {
  //   posts: 'No posts in Posts state object';
  // }


  render() {

    // ??
    // const { getPosts } = this.props;

    // console.log('rendering..');
    if ((this.props) && (this.props.posts)) {
       console.log('this.props.posts', this.props.posts);
    }
    else{
       console.log('Posts: no props! - use setStoreToProps, or setState');
    }

    return (
      <div>
          {this.props && this.props.posts &&
              (
                <ul>
                hello..can't get your posts!
                  {/*this.props.posts.map(post => {
                    return (
                      <li key={post.id}>title:{post.title}</li>
                    )
                  })*/}
                </ul>
              )
          }
          { (!this.props || !this.props.posts) &&
            <p>No Posts Available</p>
          }
      </div>
    );
  }

}

function mapDispatchToProps(dispatch){
  console.log("in Posts mapDispatchToProps");
  return ({
    getPosts: () => dispatch(fetchPosts()),
  })
}

function mapStoreToProps ( state ) {
  console.log("in Posts mapStoreToProps, state:", state);
  console.log('mSTP: posts as enter mapStoreToProps:', state.posts);

  // const postsProperties = Object.keys(posts);  // only has key of 1 post
  // console.log('properties', postsProperties);


  // let postsArray = [];
  // for (let postObject in posts) {
  //   console.log('postObject', postObject);
  //   postsArray.push(postObject);
  // }

  // posts.forEach((post) => {
  //   console.log('in Posts, mapStoreToProps, forEach, post:', post);
  //   postsArray.push(post);
  //   console.log('in Posts, mapStoreToProps, forEach, postsArray:', postsArray);
  // });
  //   console.log('in Posts, mapStoreToProps, AFTER forEach, postsArray:', postsArray);

  // return postsArray;

  return {
    posts: state.posts,
  }

};

export default connect(mapStoreToProps, mapDispatchToProps)(Posts)


/* TODO: ?
  - Perhaps setCurrentPost might be selectedPost ??
  To avoid falling into the "getters" setters" way of thinking,
  Do the ame paradigm for comments, categories, (user), etc.
*/
