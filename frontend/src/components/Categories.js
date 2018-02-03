import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCategories } from '../state/categories/ducks';

export class Categories extends Component {

  componentDidMount() {

    // if (!this.props.categories || this.props.categories === null || this.props.categories === []) {
    //   this.props.getCategories();
    // }
    // else {console.log('Categories componentDidMount ..not refetching, categories:');}//, this.props.categories);}
    // // may need to move this to App.js

    this.props.getCategories();
    console.log('Categories componentDidMount ..(re)fetching, categories:');

  }

  render() {

    // const { dispatch } = this.props;

    // const propsValue = this.props||this.state||'no props or state'
    // console.log('Categories render:', propsValue);

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

function mapStoreToProps ( store ) {
  const categoriesArray = Object.keys(store.categories).reduce((acc, categoryKey) => {
    return acc.concat([store.categories[categoryKey]]);
  }, []);

  return {
      categories: categoriesArray || null,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Categories);

