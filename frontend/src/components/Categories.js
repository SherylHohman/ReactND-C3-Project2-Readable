import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCategories } from '../state/categories/ducks';

export class Categories extends Component {

  componentWillMount() {
    this.props.getCategories();
  }

  render() {

    const { dispatch } = this.props;

    const propsValue = this.props||this.state||'no props or state'
    console.log('Categories render:', propsValue);


    return (
      <div>
        {this.props && this.props.categories &&
            (
              <ul className="nav">
                <li className="selected" key="l;asjd9f87q23j;lksa">All Categories</li>
                {this.props.categories.map(category => {
                  return (
                    <li key={category.name}>{category.name}</li>
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
    getCategories: () => dispatch(fetchCategories()),
  })
}

function mapStoreToProps ( { categories }) {
  const categoriesArray = categories.categories
  return {
      categories: categoriesArray,
  }
  //  I "fixed" nesting in reducer for setting categories from API call
  //    but in store it *still* gets nested.
  //  The only way I can seem to "fix" this to have an array in props
  //    is to unnest it as below ! PUZZLING!! But Works!
  //    this.props.categories is nor an ARRAY!
};

export default connect(mapStoreToProps, mapDispatchToProps)(Categories);

