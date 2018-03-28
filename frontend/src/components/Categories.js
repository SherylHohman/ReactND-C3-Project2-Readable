import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { createSelector } from 'reselect';

// action Creators
import { fetchCategories} from '../store/categories/actionCreators';

// Components
import FetchStatus from './FetchStatus';

// selectors
import { getFetchStatus } from '../store/categories/selectors';

// selectors, that should be refactored to regular constants
import { getCategoriesArray, getValidCategoryUrls } from '../store/categories/selectors';
// constants/helpers than maybe could be selectors instead
import { getLocFrom, getSortBy } from '../store/viewData/selectors';
import { createCategoryUrlToPathLookup } from '../store/categories/selectors';
import { computeUrlFromParamsAndRouteName } from '../store/viewData/selectors';

// helpers and constants
import { HOME, DEFAULT_SORT_BY } from '../store/viewData/constants';
import { titleCase } from '../utils/helpers';


export class Categories extends Component {
// TODO refactor to functional component

  clickDisabled(e){
    e.preventDefault();
  }

  render() {

    // fetch initiated from App.js
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

function mapStoreToProps (store, ownProps) {

  const routerProps = ownProps;

  const getSelectedCategoryPath  = createSelector(
    (routerProps) => getLocFrom(routerProps).url,
    (store)       => getValidCategoryUrls(store),
    (store) => createCategoryUrlToPathLookup(store),

    (currentUrl, validCategoryUrls, categoryUrlToPathLookup) => {
      // see if currentUrl EXACTLY matches a valid Category Url
      if (!currentUrl || (validCategoryUrls.indexOf(currentUrl) === -1)){
        // browser is not on a category path, memoise null to prevent re-render
        return null;
      }
      return categoryUrlToPathLookup[currentUrl]
    }
  );
  const selectedCategoryPath = getSelectedCategoryPath(store, routerProps);

  return {
      fetchStatus: getFetchStatus(store),
      categories:  getCategoriesArray(store) || null,
      sortBy:      getSortBy(store) || DEFAULT_SORT_BY,
      selectedCategoryPath,
  }
};

// withRouter gives access to routerProps
export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(Categories));



// NOTE for USING GETLOC getLoc in CATEGORIES component:
    //  url uses location.pathname instead of match.path
    //
    //  if component "matches" on a non-exact route,
    //  match.path and match.params may NOT reflect the full path
    //  For example, Categories Component is rendered on every path
    //  So (inside Categories) ALWAYS: match.path === '/' match.params === ''
    //    even when browser route is
    //    '/:categories', path '/react', and params is 'categoryPath: react'
    //  SO.. use location.pathname for actual url
    //    BUT.. NOTE params would still be incorrect when inside Categories
    //    - would need to self-parse the url to get the params of the actual url.
    //    Fortunately, params are not CURRENTLY needed in components that
    //    display/match on multiple/non-exact routes
    //    (Categories is the only such component currently)
    //    This Note is for FYI TroubleShooting in case this ever changes.

  // NOTE: unlike other components, do NOT use routerProps for the loc.
  //    this component renders on Every Route, and will always "Match" at route '/'.
  //    thus the routeName in this component would always be 'home', No Matter
  //    what the browser URL sais.
  //    Instead, use viewDate.loc,
  //    This way Categories renders correctly, with correct "selectedCategory"
  //      highlighted.

