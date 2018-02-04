import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../state/categories/ducks';
import { fetchPosts } from '../state/posts/ducks';
import { changeView } from '../state/viewData/ducks';

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

  onSelectCategory(categoryName=null){
    let appUrl, categoryPath;

    if (categoryName === null){
      categoryName = '';
      categoryPath = null;  // or should I change this to '' throughout app for "all posts"
      appUrl = '/';
    }
    else {
      const category = this.props.categories.find((category) => {
        return category.name === categoryName;
      });
      categoryPath = category.path;
      appUrl = `/category/${category.path}`;
    }

    this.props.getPosts(categoryPath);
    this.props.changeView(appUrl, categoryName);
  }

  render() {

    // const propsValue = this.props||this.state||'no props or state'
    // console.log('Categories render:', propsValue);

    return (
      <div>
        {this.props && this.props.categories &&
            (
              <ul className="nav">
                <Link to="/" onClick={() => {this.onSelectCategory(null)}}>
                  <li className="selected" key="all-categories">All Categories</li>
                </Link>
                {this.props.categories.map(category => {
                  return (
                    <Link key={category.name}
                      to={`/category/${category.path}`}
                      onClick={() => {this.onSelectCategory(category.name)}}>
                      <li key={category.name}>{category.name}</li>
                    </Link>
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
    getPosts: (category) => dispatch(fetchPosts(category)),
    changeView: (url, selected) => dispatch(changeView({ url, selected })),
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

