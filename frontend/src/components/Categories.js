import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { fetchCategories} from '../store/categories';
import { ROUTES } from '../store/viewData';
import { changeView, HOME, DEFAULT_SORT_BY } from '../store/viewData';

import { titleCase } from '../utils/helpers';

// Components
import FetchStatus from './FetchStatus';

// selectors
import { createSelector } from 'reselect';
import { getCategoriesArray, getValidCategoryUrls, getValidCategoryPaths, getFetchStatus } from '../store/categories';  // category selectors
import { getLoc } from '../store/viewData';


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
      return ROUTES.category.base + categoryPath;
    }

    const isExactPath = (thisCategoryPath) => {
      // return this.props.loc.url === makeCategoryLink(thisCategoryPath);
      // return this.props.loc.url === makeCategoryLink(thisCategoryPath);
      return this.props.selectedCategoryPath === thisCategoryPath;
    }

    console.log('Categories.render, re-rendering..');
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
  // console.log('Categories.mSTP, store:', store);
  // console.log('Categories.mSTP, store.categories:', store.categories);
  // console.log('Categories.mSTP, store.viewData.loc:', store.viewData.loc);
  // console.log('store.categories:', store.categories)
  // console.log('Categories, ownProps:', ownProps)

  const categoriesArray = getCategoriesArray(store);

  const getSelectedCategoryPath1 = createSelector(
    store => store.viewData.loc,
    getValidCategoryPaths,
    (loc, validCategoryPaths) => {
      console.log('Categories.mSTP.getSelectedCategoryPath, loc:', loc);
      // if currentUrl EXACTLY matches a valid Category Url
      const categoryPath = (loc && loc.categoryPath)
                            ? loc.categoryPath
                            : null;

      // or use categories.calculateRouteUrlFromLoc()
      if (categoryPath &&
         (validCategoryPaths.indexOf(categoryPath) !== -1) &&
          // future proof validation
          //   in case more ROUTES get added that incorporate :categoryPath (categoryPath)
          (loc.url === ROUTES.category.base + categoryPath)
          ){
        console.log(categoryPath, 'Categories.mSTP.getSelectedCategoryPath, categoryPath', categoryPath);
        return categoryPath;
      }
      else {
        // memoize all other routes, and invalid urls to null
        //  to prevent Categories from re-rendering on a non /:categoryPath route
        //  (b/c Categories UI displays/matches on ALL pages, not just '/:categoryPath')
        console.log('NULL Categories.mSTP.getSelectedCategoryPath, memoised as NULL');
        return null;
      }
    }
  );
  // const selectedCategoryPath = getSelectedCategoryPath1(store);

  const getSelectedCategoryPath2 = createSelector(
    store => store.viewData.loc.categoryPath || null,
    getValidCategoryPaths,

    (categoryPath, validCategoryPaths) => {
      console.log('Categories.mSTP.getSelectedCategoryPath, categoryPath:', categoryPath);

      // if currentUrl EXACTLY matches a valid Category Url
      if (categoryPath && (validCategoryPaths.indexOf(categoryPath) !== -1)){
         console.log(categoryPath, 'Categories.mSTP.getSelectedCategoryPath, categoryPath', categoryPath);
        return categoryPath;
      }
      else {
        // memoize all other routes, and invalid urls to null
        //  to prevent Categories from re-rendering on a non /:categoryPath route
        //  (b/c Categories UI displays/matches on ALL pages, not just '/:categoryPath')
        console.log('NULL Categories.mSTP.getSelectedCategoryPath, memoised as NULL');
        return null;
      }
    }
  );
  let selectedCategoryPath2 = getSelectedCategoryPath2(store);
  if (selectedCategoryPath2 &&
     (store.viewData.loc.url !== (ROUTES.category.base + selectedCategoryPath2))
     ){
      // or use categories.calculateRouteUrlFromLoc()
      //   future proof validation
      //   in case more ROUTES get added that incorporate :categoryPath (categoryPath),
      //   invalidate the selectedCategoryPath2, return null instead
    selectedCategoryPath2 = null;
  }
  const selectedCategoryPath = selectedCategoryPath2;
  // const selectedCategoryPath = selectedCategoryPath1;

  // const selectedCategoryPath = store.viewData.loc.categoryPath || null;
  // console.log('__Categories.selectedCategoryPath:', selectedCategoryPath);

  const routerProps = { history:ownProps.history, location: ownProps.location, match: ownProps.match };
  console.log('__Categories.mSTP viewData',
              // '\nrouterProps:', routerProps,
              // '\ngetLoc loc  :', getLoc(routerProps),
              '\nviewData loc:', store.viewData.loc,
              // '\nloc         :', loc,
              '\nselectedCategoryPath:', selectedCategoryPath,
              );
  const fetchStatus = getFetchStatus(store);

  return {
      fetchStatus,  //: getFetchStatus(store),
      categories: categoriesArray   || null,
      sortBy: store.viewData.sortBy || DEFAULT_SORT_BY,
      selectedCategoryPath,  // null if not on a valid category URL (ROUTE.category.path)
  }
};

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(Categories));
