import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchCategories } from '../store/categories';
import { fetchPosts } from '../store/posts';
import { changeView, HOME, DEFAULT_SORT_BY, getUri } from '../store/viewData';


export class Categories extends Component {

  componentDidMount() {
    // may need to move this to App.js
    this.props.fetchCategories();
    console.log('Categories componentDidMount ..fetching, categories');

    if (this.props.uri){
      console.log('__Categories cDM calling changeView, this.props.uri', this.props.uri);
      this.props.changeView(this.props.uri)
    }
    else {
      console.log('__Categories cDM NOT calling changeView, this.props.uri', this.props.uri);
    }
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

  // TODO: Do I fetch POSTS based on changing uri instead ??
  onSelectCategory(categoryPath){
  //   const category = this.getCategoryFromName(categoryPath);
  //   this.props.getPosts(category.path);

    // const categoryPath = this.props.categories[categoryName].path || HOME.category.path;
    this.props.getPosts(categoryPath);
  }

  render() {

    const isExactPath = () => {
      // TEMP
      if (!this.props.history || !this.props.history.location || !this.props.history.location.pathname){
        return false;
      }

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
                      onClick={() => {this.onSelectCategory(HOME.category.path)}}
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
                      onClick={() => {this.onSelectCategory(category.path)}}
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
    // changeView: (id, url) => dispatch(changeView({ currentId: id, currentUrl: url })),
    // changeViewByCategory: (category) => dispatch(changeView(category)),
    changeView: (uri) => dispatch(changeView({ uri })),
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('store.categories:', store.categories)
  // console.log('Categories, ownProps:', ownProps)
  const categoriesArray = Object.keys(store.categories).reduce((acc, categoryKey) => {
    return acc.concat([store.categories[categoryKey]]);
  }, []);

  // so don't have to refactor former history.push references
  const history = (ownProps.routerInfo && ownProps.routerInfo.history )|| null;

  const uri = getUri(ownProps.routerInfo) || null;
  // console.log('uri:', uri);
  // uri.currentId === uri.categoryPath === categories[uri.categoryPath].path
  const category = (uri.currentId && store.categories &&
                    store.categories[uri.currentId]) || HOME.category;

  return {
      categories: categoriesArray || null,
      // category: store.viewData.category || HOME.category,
      sortBy:   store.viewData.sortBy   || DEFAULT_SORT_BY,

      uri,
      currentCategory: category,  //TEMP
      currentCategoryPath: category.path,  //TEMP
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Categories);
