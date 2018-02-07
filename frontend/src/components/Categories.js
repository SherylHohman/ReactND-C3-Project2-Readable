import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchCategories } from '../store/categories';
import { fetchPosts } from '../store/posts';
import { changeView, HOME } from '../store/viewData';


export class Categories extends Component {

  state = {
    category: '',
  }

  componentDidMount() {
    // may need to move this to App.js
    this.props.fetchCategories();
    console.log('Categories componentDidMount ..(re)fetching, categories');

    if (this.props && this.props.category){
      console.log('cdm, category:', this.props.category);
      this.setState({ category: this.props.category });
    }
  }

  getCategoryFromName(categoryName){
    if (!categoryName || categoryName === null || categoryName === ''){
      console.log('error: categoryName is invalid, Categories.js: getCategoryFromName, setting to categories[0]', this.props.categories[0]);
      return {name: '', path: ''};  // home page, show all categories
    } else {
      return this.props.categories.find((category) => {
        return category.name === categoryName;
      });
    }
  }

  onSelectCategory(categoryName){
    const category = this.getCategoryFromName(categoryName);
    console.log('__category for changeView:', category);
    this.props.changeViewByCategory(category);
    this.props.getPosts(category.path || null);
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

    const isExactPath = () => {
      return (this.props.category.name === HOME.category.name);
      // breaks when app is loaded from a saved url
    }

    return (
      <div>
        {this.props && this.props.categories &&
            (
              <ul className="nav">
                <NavLink to="/"
                      onClick={() => {this.onSelectCategory('')}}
                      activeClassName={"selected"}
                      isActive={isExactPath}
                      >
                  <li key="all-categories-makeSureThisKeyIsUnique">
                    All Categories
                  </li>
                </NavLink>
                {this.props.categories.map(category => {
                  return (
                    <NavLink key={category.name}
                      to={`/category/${category.path}`}
                      onClick={() => {this.onSelectCategory(category.name)}}
                      activeClassName="selected"
                          >{category.name}
                      <li key={category.name}></li>
                    </NavLink>
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
    changeView: (id, url) => dispatch(changeView({ id, url })),
    changeViewByCategory: (category) => dispatch(changeView({ category })),
    // selectCategory: (category) => dispatch(selectCategory(category)),
  })
}

function mapStoreToProps ( store ) {
  console.log('store.categories:', store.categories)
  const categoriesArray = Object.keys(store.categories).reduce((acc, categoryKey) => {
    return acc.concat([store.categories[categoryKey]]);
  }, []);
  console.log('store.categories:', store.categories)

  const categoryAll = {name: '', path: ''}; // or path=null or '/' or ''
  console.log('to be props.category:', store.viewData.category, 'or categoryAll:', categoryAll);

  return {
      categories: categoriesArray || null,
      // categoriesPlus: categoriesArray.concat[allCategories],
      category: store.viewData.category || categoryAll,
      sortBy:   store.viewData.sortBy   || 'date',
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Categories);
