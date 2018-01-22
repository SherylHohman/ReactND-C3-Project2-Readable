import React, { Component } from 'react';
import { connect } from 'react-redux';
import Categories from './Categories';
import Posts from './Posts';

class App extends Component {

  componentWillMount() {
    console.log("in App componentWillMount");
  }

  state: {
    username: '',   // controlled input
  }

  render() {

    return (
      <div className="app-container">
        <input placeholder="Sign In to: Vote, Comment, Create/Edit Posts" />
        <header className="app-header">
          <h1 className="app-title">Readable</h1>
          <Categories />
        </header>
        <div className="app-intro">
          ..an app for posting and viewing posts and comments
          <hr />
        </div>
        <Posts />
        <hr />
      </div>
    );
  }
}

// function mapDispatchToProps(dispatch){
//   return ({

//   })
// }

// function mapStoreToProps ( { posts }) {
//   return {

//   }
// };

// export default connect(mapStoreToProps, mapDispatchToProps)(App);

 export default App;
