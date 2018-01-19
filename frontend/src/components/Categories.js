import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCategories } from '../utils/api';

export class Categories extends Component {

  state: {
    categories: "fetching categories..",
  }

  componentWillMount() {
    console.log("in Categories componentWillMount");

    fetchCategories().then((categoryObjects) => {

      const categories = categoryObjects
        .reduce((acc, categoryObject) => {
          return acc.concat(categoryObject.name);
        }, []);
      console.log('categories as array;', categories);

      this.setState({ categories });
    });
  }

  render() {

    if ((this.state) && (this.state.categories)) {
      console.log('this.state.categories', this.state.categories);
    }
    else{
      console.log('no state! - use setStoreToProps, or setState');
    }

    return (
      <div>
        {/*temp categories render*/}
        {this.state && this.state.categories &&
            (
              <ul>
                {this.state.categories.map(category => {
                  return (
                    <li key={category}>{category}</li>
                  )
                })}
              </ul>
            )
        }
        { (!this.state || !this.state.categories) &&
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
  return {

  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Categories);

