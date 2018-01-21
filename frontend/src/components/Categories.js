import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCategories } from '../state/categories/ducks';
  //  fetchCategories is a "Fat Action Creator"
  //    It dispatches FetchPosts action, Handles ajax, then dispatches
  //    a resolution (success, failure) action.
  //  "ducks" *file* has actions, action creators, and reducers.
  //    As expand app, may separate these into actions and reducers
  //    in a ducks **folder** (the proper design)

export class Categories extends Component {

  // getCategories() {
  //   console.log('hi');
  // }


  componentWillMount() {
    console.log("in Categories componentWillMount");

    // ??
    // const { getCategories } = this.props;
    this.props.getCategories();

    // fetchCategories().then((categories) => {
    //   // console.log('cDM|fetchCategories: categories as array of objects, with extraneous getRequest properties: ', categories)
    //   // this.setState({ categories });
    // });

    console.log('Categories cDM, leaving fetchCategories:', `${this.state||this.props||'no state or props'}`);
  }

  render() {

    // ??
    const { dispatch } = this.props;

    if ((this.props) && (this.props.categories)) {
      console.log('...this.PROPS.categories', this.props.categories);
    }
    else{
      console.log('...Categories: no props! - use setStoreToProps, or setState');
    }

    return (
      <div>
  Objects are not valid as a React child (found: object with keys `categories`). If you meant to render a collection of children, use an array instead.
  {/* TODO: turn API/Store obj data into react array so can map over */}

{/*        {this.props && this.props.categories &&
            (
              <ul>
                {this.props.categories.map(category => {
                  return (
                    <li key={category}>{category}</li>
                  )
                })}
              </ul>
            )
        }
        { (!this.props || !this.props.categories) &&
            <p>No Categories Available</p>
        }
*/}      </div>
    );
  }

}

// export default Categories
function mapDispatchToProps(dispatch){
  console.log("in Categories mapDispatchToProps");

  return ({
    getCategories: () => dispatch(fetchCategories()),
  })
}

function mapStoreToProps ( { categories }) {
  console.log("in Categories mapStoreToProps, categories IN:", categories);

  // console.log('mSTP: categories as enter mapStoreToProps;', categories);
  // console.log('mSTPcategories.categories as enter mapStoreToProps;', categories.categories);

  return {
      categories: categories.categories,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Categories);

