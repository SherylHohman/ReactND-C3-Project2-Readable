import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchCategories } from '../store/categories';
import { fetchPosts } from '../store/posts';
import { changeView, HOME, DEFAULT_SORT_BY } from '../store/viewData';


export class Categories extends Component {

  componentDidMount() {
    // may need to move this to App.js
    this.props.fetchCategories();
    console.log('Categories componentDidMount ..fetching, categories');
  }

  getCategoryFromName(categoryName){
    if (!categoryName){
      return HOME.category;  // home page, show all categories
    } else {
      return this.props.categories.find((category) => {
        return category.name === categoryName;
      });
    }
  }

  onSelectCategory(categoryName){
    const category = this.getCategoryFromName(categoryName);
    this.props.changeViewByCategory(category);
    this.props.getPosts(category.path);
  }

  render() {

    const isExactPath = () => {
      return (('/' + this.props.category.path) === this.props.history.location.pathname);
    }

    return (
      <div>
        {this.props && this.props.categories &&
            (
              <ul className="nav filter">
                <li className="no-link"> Category: </li>
                <NavLink key="all-categories-makeSureThisKeyIsUnique"
                      to={HOME.category.path}
                      onClick={() => {this.onSelectCategory(HOME.category.name)}}
                      activeClassName={"selected"}
                      isActive={isExactPath}
                      >
                  <li key="all-categories-makeSureThisKeyIsUnique">
                    All
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
    changeView: (id, url) => dispatch(changeView({ currentId: id, currentUrl: url })),
    changeViewByCategory: (category) => dispatch(changeView(category)),
  })
}

function mapStoreToProps ( store ) {
  // console.log('store.categories:', store.categories)
  const categoriesArray = Object.keys(store.categories).reduce((acc, categoryKey) => {
    return acc.concat([store.categories[categoryKey]]);
  }, []);

  return {
      categories: categoriesArray || null,
      category: store.viewData.category || HOME.category,
      sortBy:   store.viewData.sortBy   || DEFAULT_SORT_BY,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Categories);
