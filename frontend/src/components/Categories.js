import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchCategories } from '../store/categories';
import { changeView, HOME, DEFAULT_SORT_BY, getUri } from '../store/viewData';


export class Categories extends Component {

  componentDidMount() {
    this.props.fetchCategories();
    // console.log('Categories componentDidMount ..fetching, categories');

    if (this.props.uri){
      // console.log('Categories cDM calling changeView, this.props.uri', this.props.uri);
      this.props.changeView(this.props.uri)
    }
    else {
      // console.log('Categories cDM NOT calling changeView, this.props.uri', this.props.uri);
    }
  }

  render() {

    const isExactPath = () => {
      return (this.props.uri && this.props.uri.url) &&
             (this.props.uri.url === HOME.url);
    }

    return (
      <div>
        {this.props && this.props.categories &&
            (
              <ul className="nav filter">
                <li className="no-link"> Category: </li>
                <NavLink key="all-categories-makeSureThisKeyIsUnique"
                      to={HOME.category.path}
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
    changeView: (uri) => dispatch(changeView({ uri })),
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('store.categories:', store.categories)
  // console.log('Categories, ownProps:', ownProps)

  // so don't have to refactor former history references
  // const history = (ownProps.routerInfo && ownProps.routerInfo.history )|| null;

  const categoriesArray = Object.keys(store.categories).reduce((acc, categoryKey) => {
    return acc.concat([store.categories[categoryKey]]);
  }, []);

  const uri = getUri(ownProps.routerProps) || null;

  return {
      categories: categoriesArray   || null,
      sortBy: store.viewData.sortBy || DEFAULT_SORT_BY,
      uri,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Categories);
