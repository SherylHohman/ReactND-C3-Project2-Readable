import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCategories } from '../utils/api';

export class Categories extends Component {

  componentWillMount() {
    // console.log("in Categories componentWillMount");

    fetchCategories().then((categories) => {
      // console.log('cDM|fetchCategories: categories as array of objects, with extraneous getRequest properties: ', categories)
      // this.setState({ categories });
    });
    // console.log('cDM, leaving fetchCategories:', `${this.state||this.props||'no state or props'}`);
  }

  render() {

    if ((this.props) && (this.props.categories)) {
      console.log('...this.PROPS.categories', this.props.categories);
    }
    else{
      console.log('...Categories: no props! - use setStoreToProps, or setState');
    }

    return (
      <div>
        {/*temp categories render*/}
        {this.props && this.props.categories &&
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
      </div>
    );
}

}

// export default Categories
function mapDispatchToProps(dispatch){
  return ({

  })
}

function mapStoreToProps ( { categories }) {

  // console.log('mSTP: categories as enter mapStoreToProps;', categories);
  // console.log('mSTPcategories.categories as enter mapStoreToProps;', categories.categories);

  return {
      categories: categories.categories,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Categories);

