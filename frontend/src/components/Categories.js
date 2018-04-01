import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

// action Creators
import { fetchCategories} from '../store/categories/actionCreators';

// Components
import FetchStatus from './FetchStatus';

// selectors
import { getCurrentCategoryPath } from '../store/categories/selectors';
// values should not change - after initial categories fetch (successfully)
import { getFetchStatus, getCategoriesArray } from '../store/categories/selectors';

// helpers and constants
import { computeUrlFromParamsAndRouteName } from '../store/viewData/constants';
import { HOME, DEFAULT_SORT_BY } from '../store/viewData/constants';
import { titleCase } from '../utils/helpers';


export class Categories extends Component {

  clickDisabled(e){
    e.preventDefault();
  }

  render() {

    // categories fetch was initiated from App.js
    if (!this.props.categories) {
      // loading "spinner", fetch failure, or 404
      return (
        <FetchStatus routerProps={ this.props.routerProps }
          fetchStatus={this.props.fetchStatus}
          label={'categories'}
          item={this.props.categories}
          retryCallback={()=>this.props.fetchCategories()}
        />
      );
    }

    const makeCategoryLink = (categoryPath) => {
      return computeUrlFromParamsAndRouteName(
                      {categoryPath: categoryPath},
                      'category',
             );
    }

    const isExactPath = (thisCategoryPath) => {
      return (this.props.currentCategoryPath === thisCategoryPath);
    }

    // console.log('Categories.render, re-rendering..');  // monitor for unnecessary re-renders
    return (
      <div>
        {this.props && this.props.categories &&
            (
              <ul className="nav filter">

                <li key="categories-label-makeSureThisKeyIsUnique"
                        className="no-link"> Category: </li>

                { isExactPath(HOME.category.path) ?
                  (  <NavLink key="disabled-all-categories-makeSureThisKeyIsUnique"
                        to={(HOME.category.path)}
                        className={"selected"}
                        onClick={this.clickDisabled}
                        >
                      <li key="all-categories-makeSureThisKeyIsUnique">
                        All
                      </li>
                    </NavLink>
                  ) : (
                    <NavLink key="navlink-all-categories-makeSureThisKeyIsUnique"
                        to={(HOME.category.path)}
                        >
                      <li key="all-categories-makeSureThisKeyIsUnique">
                        All
                      </li>
                    </NavLink>
                  )
                }

                {this.props.categories.map(category => {
                  if (isExactPath(category.path)) {
                    return (
                      <NavLink key={"disabled-"+category.name}
                        to={makeCategoryLink(category.path)}
                        className="selected"
                        onClick={this.clickDisabled}
                        >
                        <li key={category.name}>
                        {titleCase(category.name)}
                        </li>
                       </NavLink>
                    )
                  }
                  else {
                    return (
                      <NavLink key={"navlink-"+category.name}
                        to={makeCategoryLink(category.path)}
                        >
                        <li key={category.name}>
                        {titleCase(category.name)}
                        </li>
                       </NavLink>
                    )
                  }
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
  })
}

function mapStoreToProps (store) {

  // routerProps always matches on '/' for categories component, so
  //    MUST pass in null, as 2nd param to force using the "stored" route
  // Currently, I am removing access to routerProps, or ownProps.
  //    So *As Is* this 2nd param is not strictly necessary (as it's "undefined")
  //    However, if mapStoreToProps is changed have access to _ownProps_, then it will
  //    be AUTOMATICALLY passed to getCurrentCategoryPath, and interpreted as
  //    routerProps, whether routerProps itself exists or not.
  //    If ownProps!==routerProps, a runtime error might result when "get.."
  //    tries to access a "routerProps" property on the "ownProps" variable.
  //    If routerProps *does* become available, then the "get..." selectors
  //    will try to use routerProps instead of store for this component.
  //    And as stated previously, routerProps would yield incorrect results.
  //    Hence, Explicitly passing "null" as 2nd param future proofs against errors
  const currentCategoryPath = getCurrentCategoryPath(store, null);

  return {
      fetchStatus: getFetchStatus(store),
      categories:  getCategoriesArray(store) || null,
      currentCategoryPath,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Categories);
