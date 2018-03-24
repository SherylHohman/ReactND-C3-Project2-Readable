import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { fetchCategories} from '../store/categories';

// Components
import FetchStatus from './FetchStatus';

// selectors
import { createSelector } from 'reselect';
import { getFetchStatus } from '../store/categories';  // category selectors

// selectors, that should be refactored to regular constants
import { getCategoriesArray, getValidCategoryUrls } from '../store/categories';
// constants/helpers than maybe could be selectors instead
import { getLocFrom } from '../store/viewData';

// helpers and constants
import { HOME, DEFAULT_SORT_BY } from '../store/viewData';
import { titleCase } from '../utils/helpers';
import { computeUrlFromParamsAndRouteName } from '../store/viewData';
import { createCategoryUrlToPathLookup } from '../store/categories';


export class Categories extends Component {
// TODO refactor to functional component

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
      return (this.props.selectedCategoryPath === thisCategoryPath);
    }

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

function mapStoreToProps (store, ownProps) {

  // this could change..
  const routerProps = ownProps;

  // so can use as an input to getSelectedCategoryPath
  const getUrl = createSelector(
    getLocFrom,  // must call with (null, routerProps) or (store, routerProps)
    (loc) => loc.url,
  );

  const categoryUrlToPathLookup  = createCategoryUrlToPathLookup(store);
  const getSelectedCategoryPath  = createSelector(
    getUrl,                     // ( ,routerProps)
    getValidCategoryUrls,       // ()

    (currentUrl, validCategoryUrls) => {
      // verify currentUrl EXACTLY matches a valid Category Url
      let selectedCategoryPath;
      if (currentUrl && (validCategoryUrls.indexOf(currentUrl) !== -1)){
          const matchedUrl = currentUrl;
          selectedCategoryPath = categoryUrlToPathLookup[matchedUrl]
      }
      else {
          // browser is not on a category path, memoise as null
          selectedCategoryPath = null;
      }
      return selectedCategoryPath;
    }
  );
  const selectedCategoryPath = getSelectedCategoryPath(store, routerProps);

  // Do NOT pass routerProps as 2nd parameter!, or anything else as 2nd param!
  const fetchStatus      = getFetchStatus(store);
  const categoriesArray  = getCategoriesArray(store);

  return {
      fetchStatus,
      categories: categoriesArray   || null,
      sortBy: store.viewData.sortBy || DEFAULT_SORT_BY,
      selectedCategoryPath,  // null if not on a valid category URL
  }
};

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(Categories));
