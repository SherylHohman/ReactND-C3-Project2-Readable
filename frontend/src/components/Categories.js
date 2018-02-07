import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../store/categories';
import { fetchPosts } from '../store/posts';
import { changeView } from '../store/viewData';

export class Categories extends Component {

  state = {
    category: '',
  }

  componentDidMount() {
    // may need to move this to App.js
    this.props.fetchCategories();
    console.log('Categories componentDidMount ..(re)fetching, categories');

    if (this.props && this.props.category){
      this.setState({ category: this.props.category });
    }
  }

  getCategoryFromName(categoryName){
    if (!categoryName || categoryName === null || categoryName === ''){
      console.log('error: categoryName is invalid, Categories.js: getCategoryFromName, setting to categories[0]', this.props.categories[0]);
      return null; //({name: '', path: '/'});  // home page, show all categories
    } else {
      return this.props.categories.find((category) => {
        return category.name === categoryName;
      });
    }
  }

  onSelectCategory(categoryName){
    const category = this.getCategoryFromName(categoryName);
    this.props.changeView(category);
    this.props.getPosts(category.path);  // category.path could fail if category is null
  }

  setOnclickFunction(){
    let TODO;   // placeholder for TODO. compiler won't complain.
    if ( TODO ) {
      return () => {this.onSelectCategory}
    }
    else {
      // no onclick handler for category on current route
      // TODO no mouse pointer
      // TODO no linkTo
      return null;
    }
  }

  render() {

    return (
      <div>
        {this.props && this.props.categories &&
            (
              <ul className="nav">
                <Link to="/"
                      onClick={() => {this.onSelectCategory('')}}>
                  <li className="selected"
                      key="all-categories-makeSureItsUnique"
                      >All Categories
                  </li>
                </Link>
                {this.props.categories.map(category => {
                  return (
                    <Link key={category.name}
                      to={`/category/${category.path}`}
                      onClick={() => {this.onSelectCategory(category.name)}}>
                      <li className="selected"
                          key={category.name}
                          >{category.name}
                      </li>
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

function mapDispatchToProps(dispatch){
  return ({
    fetchCategories: () => dispatch(fetchCategories()),
    getPosts: (category) => dispatch(fetchPosts(category)),
    changeView: (category) => dispatch(changeView({ category })),
    // selectCategory: (category) => dispatch(selectCategory(category)),
  })
}

function mapStoreToProps ( store ) {
  const categoriesArray = Object.keys(store.categories).reduce((acc, categoryKey) => {
    return acc.concat([store.categories[categoryKey]]);
  }, []);
  const allCategories = {name: 'all', path: '/'};

  return {
      categories: categoriesArray || null,
      // categoriesPlus: categoriesArray.concat[allCategories],
      category: store.viewData.category || '',
      sortBy: store.viewData.ssortBy || 'date',
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Categories);
