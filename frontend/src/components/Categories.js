import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
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
import { HOME } from '../store/viewData/constants';
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

Categories.propTypes = {
  fetchCategories: PropTypes.func.isRequired,
}


function mapDispatchToProps(dispatch){
  return ({
    fetchCategories: () => dispatch(fetchCategories()),
  })
}

function mapStoreToProps (store) {

  // routerProps always matches on '/' for categories component, so
  //    Pass in null, as 2nd param to forces using the "stored" route.
  //    Explicitly passing this 2nd param to remind that it takes 2 parms,
  //    and that I never want to pass in routerProps from this component.
  const currentCategoryPath = getCurrentCategoryPath(store, null);

  return {
      fetchStatus: getFetchStatus(store),
      categories:  getCategoriesArray(store) || null,
      currentCategoryPath,
  }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Categories);
