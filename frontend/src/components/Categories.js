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
      // return ROUTES.category.base + categoryPath;
      return computeUrlFromParamsAndRouteName(
                      {categoryPath: categoryPath},
                      'category',
             );
    }

    const isExactPath = (thisCategoryPath) => {
      // return this.props.loc.url === makeCategoryLink(thisCategoryPath);
      // return this.props.loc.url === makeCategoryLink(thisCategoryPath);
      // if (this.props.selectedCategoryPath === thisCategoryPath) {
        console.log('Categories.isExactPath',
                    // '\nthis.props.selectedCategoryPath: ', this.props.selectedCategoryPath,
                    '\nthis.props.selectedCategoryUrl: ', this.props.selectedCategoryUrl,
                    '\nthisCategoryPath: ', thisCategoryPath,
                    '\n isExact? ', (this.props.selectedCategoryPath === thisCategoryPath),
    //                 '\n isExact? ', (this.props.selectedCategoryUrl ===
    // computeUrlFromParamsAndRouteName({categoryPath: thisCategoryPath}, 'category')),
                    );
      // }
      return (this.props.selectedCategoryPath === thisCategoryPath);
      // return (this.props.selectedCategoryUrl ===
      // computeUrlFromParamsAndRouteName({categoryPath: thisCategoryPath}, 'category'));
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


  // const routerProps = { history:ownProps.history, location: ownProps.location, match: ownProps.match };
  const routerProps = ownProps;
  console.log('Categories.mSTP, routerProps', routerProps);

  // ---- WIP ------
  const getUrl = createSelector(
    getLocFrom,  // must call this selector with (null, routerProps) or (store, routerProps)
    // (loc) => loc.url,
    (loc) =>  ( loc ? loc.url : null ),
  );
  const url = getUrl(null, routerProps);

  const categoryUrlToPathLookup  = createCategoryUrlToPathLookup(store);
  const getSelectedCategoryPath4 = createSelector(
    getUrl,                 // ( ,routerProps)
    getValidCategoryUrls,   // ()

    (currentUrl, validCategoryUrls) => {
      console.log('Categories.mSTP.getSelectedCategoryPath4, currentUrl:', currentUrl,
                  '\nvalidCategoryUrls:', validCategoryUrls);

      // does currentUrl EXACTLY match a valid Category Url ?
      let selectedCategoryPath;
      if (currentUrl && (validCategoryUrls.indexOf(currentUrl) !== -1)){
          console.log(currentUrl, 'Categories.mSTP.getSelectedCategoryPath, currentUrl', currentUrl);
          const matchedUrl = currentUrl;
          selectedCategoryPath = categoryUrlToPathLookup[matchedUrl]
      }
      else {
          // not on a category path,
          console.log('NULL Categories.mSTP.getSelectedCategoryPath, not on a categoryPath (memoize NULL');
           selectedCategoryPath = null;
      }
      return selectedCategoryPath;
    }
  );
  const selectedCategoryPath = getSelectedCategoryPath4(store, routerProps);

  // const getSelectedCategoryPath = createSelector(
  //   // store => store.viewData.loc,
  //   // getLocFrom,
  //   getValidCategoryPaths,
  //   (loc, validCategoryPaths) => {
  //     console.log('Categories.mSTP.getSelectedCategoryPath1, loc:', loc);
  //     // if currentUrl EXACTLY matches a valid Category Url
  //     const categoryPath = (loc && loc.categoryPath)
  //                           ? loc.categoryPath
  //                           : null;

  //     let matchedPath;
  //     // or use categories.calculateRouteUrlFromLoc()
  //     if (categoryPath &&
  //        (validCategoryPaths.indexOf(categoryPath) !== -1) &&
  //         // future proof validation
  //         //   in case more ROUTES get added that incorporate :categoryPath (categoryPath)
  //         (loc.url === ROUTES.category.base + categoryPath)
  //         ){
  //       console.log(categoryPath, 'Categories.mSTP.getSelectedCategoryPath, categoryPath', categoryPath);
  //        matchedPath = categoryPath;
  //     }
  //     else {
  //         // not on a category path,
  //         console.log('NULL Categories.mSTP.getSelectedCategoryPath, not on a categoryPath (memoize NULL');
  //       matchedPath = null;
  //     }
  //     return matchedPath;
  //   }
  // );


// I Do NOT want to use the categoryPath stored in loc, because it is one page refresh behind,
//  INITIALLY, and thus requires an extra page render, AFTER the PAGE cDM calls changeView.
// Cannot use routerProps to read the categoryPath, because this component matches on '/'
//  thus categoryPath will always be non-existant when called from this component.
// HENCE, I'm getting the current URL from routerProps.
//    Then checking to see if the PAGE url is a category URL.
//    IF so, then must reverse lookup the url to matched category
//    in order to highlight the selected category.
//    Actually, *can* call get... from inside isExact function.
//    But that seems too low level a call to make from inside render.
//    It's technically fine.  But render should not need to know details on how
//    routes are created.  Seems better to give this component the item it actually
//    needs/consumes.  In this case that would be categoryPath, NOT categoryUrl.


  // Do NOT pass reouterProps as 2nd parameter!, or anything else as 2nd param!
  // const selectedCategoryPath = getSelectedCategoryPath4(store, routerProps);


  console.log('__Categories.mSTP',
              // '\nviewData loc:', store.viewData.loc,
              '\nrouter url:', url,
              '\nselectedCategoryPath:', selectedCategoryPath,
              // '\nselectedCategoryUrl:', selectedCategoryUrl,
              '\nisExact routerProps:', routerProps);
  const fetchStatus = getFetchStatus(store);
  const categoriesArray  = getCategoriesArray(store);

  // NOTE: unlike other components, do NOT use routerProps for the loc.
  //    this component renders on Every Route, and will always "Match" at route '/'.
  //    thus the routeName in this component would always be 'home', No Matter
  //    what the browser URL sais.
  //    Instead, use viewDate.loc,
  //    This way Categories renders correctly, with correct "selectedCategory"
  //      highlighted.

  return {
      fetchStatus,  //: getFetchStatus(store),
      categories: categoriesArray   || null,
      sortBy: store.viewData.sortBy || DEFAULT_SORT_BY,
      selectedCategoryPath,  // null if not on a valid category URL (ROUTE.category.path)
      // selectedCategoryUrl,  // null if not on a valid category URL (ROUTE.category.path)
      // url,
  }
};

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

